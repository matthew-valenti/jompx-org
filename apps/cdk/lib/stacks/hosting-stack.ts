import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import * as changeCase from 'change-case';
import * as jompx from '@jompx/constructs';

export interface HostingStackProps extends cdk.StackProps {
    // userPool: cdk.aws_cognito.UserPool;
}

export class HostingStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props: HostingStackProps) {
        super(scope, id, props);

        const config = new jompx.Config(this.node);
        const stage = config.stage();

        const domainName = 'jompx.com'; // TODO: Move to config? What about multiple domain names?
        const appNames = ['admin']; // TODO: Move to config?

        // Create one wildcard certificate for all apps (on a single domain).
        new jompx.HostingCertificate(this, 'HostingCertificate', {
            domainName
        });

        appNames.forEach(appName => {
            const appNamePascalCase = changeCase.pascalCase(appName);

            // Create one S3 bucket per app.
            const hostingS3 = new jompx.HostingS3(this, `HostingS3${appNamePascalCase}`, {
                domainName,
                appName
            });

            const pipelineS3 = new jompx.AppPipelineS3(this, `AppPipelineS3${appNamePascalCase}`);

            const codebuildBuildSpecObject = {
                version: 0.2,
                env: {
                    variables: {
                        STAGE: `${stage}`,
                        BUCKET_NAME: `${hostingS3.outputs.bucket.bucketName}`,
                        APP_NAME: `${appName}`
                    }
                },
                phases: {
                    install: {
                        commands: [
                            'npm ci',
                            'npm install -g @angular/cli > /dev/null',
                            'npm install -g @ionic/cli',
                            'npm install -g @aws-amplify/cli'
                        ]
                    },
                    build: {
                        commands: [
                            'echo STAGE=$STAGE',
                            'echo APP_NAME=$APP_NAME',
                            'ionic build --project $APP_NAME'
                            // 'ionic build --project $APP_NAME --configuration=$STAGE'
                        ]
                    },
                    post_build: {
                        commands: [
                            'if [ $CODEBUILD_BUILD_SUCCEEDING = 1 ]; then aws s3 sync "apps/$APP_NAME/www/" "s3://$BUCKET_NAME/" --delete" --quiet; fi'
                        ]
                    }
                }
            };

            new jompx.AppPipeline(this, `AppPipeline${appNamePascalCase}`, {
                stage,
                appName,
                hostingBucket: hostingS3.outputs.bucket,
                pipelinegBucket: pipelineS3.outputs.bucket,
                gitHub: {
                    owner: 'matthew-valenti',
                    repo: 'jompx-org',
                    token: cdk.SecretValue.secretsManager('/cicd/github/token')
                },
                codebuildBuildSpecObject
            });

            // Output S3 bucket static URL (for reference only).
            // new cdk.CfnOutput(this, `${appName}BucketDomainName`, {
            //     value: hostingS3.outputs.bucket.bucketWebsiteDomainName
            // });
        });
    }
}