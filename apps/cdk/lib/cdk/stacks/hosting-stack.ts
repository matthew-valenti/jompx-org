import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as changeCase from 'change-case';
import * as jompx from '@jompx/constructs';

export interface HostingStackProps extends cdk.StackProps {
    // userPool: cdk.aws_cognito.UserPool;
}

export class HostingStack extends cdk.Stack {

    // Share wild card certificates with other stacks.
    public certificates = new Map<string, acm.Certificate>();

    constructor(scope: Construct, id: string, props: HostingStackProps) {
        super(scope, id, props);

        const config = new jompx.Config(this.node);
        const stage = config.stage();

        const rootDomainNames = config.appRootDomainNames();
        const apps = config.apps();

        if (apps) {

            // Create one wildcard certificate per unique app domain. Created in US East (N. Virginia) region.
            const hostingCertificates = new Map<string, jompx.HostingCertificate>();
            rootDomainNames?.forEach(rootDomainName => {
                const hostingCertificate = new jompx.HostingCertificate(this, 'HostingCertificate', {
                    rootDomainName
                });
                hostingCertificates.set(rootDomainName, hostingCertificate);
            });

            apps.forEach(app => {
                const appNamePascalCase = changeCase.pascalCase(app.name);

                // Derive the app domain name from stage e.g. admin.jompx.com, admin.test.jompx.com, admin.sandbox1.admin.com
                const domainName = stage === 'prod' ? `${app.name}.${app.rootDomainName}` : `${app.name}.${stage}.${app.rootDomainName}`;

                const zone = route53.PublicHostedZone.fromLookup(this, 'LookupHostedZone', { domainName: `${stage}.${app.rootDomainName}` });
                const certificate = hostingCertificates.get(app.rootDomainName)?.certificate;
                
                if (certificate) {
                    this.certificates.set(app.rootDomainName, certificate);
                }

                if (zone && certificate) {

                    // Create one S3 bucket per app.
                    const hostingS3 = new jompx.HostingS3(this, `HostingS3${appNamePascalCase}`, {
                        domainName
                    });

                    // Create one CloudFront distribution per app.
                    const hostingCloudFront = new jompx.HostingCloudFront(this, `HostingCloudFront${appNamePascalCase}`, {
                        domainName,
                        bucket: hostingS3.bucket,
                        certificate,
                        // Include 'ngsw-cache-bust' in cache key to allow Angluar Service Worker cache busting.
                        cachePolicyQueryStringAllowList: cloudfront.CacheQueryStringBehavior.allowList('ngsw-cache-bust')
                    });

                    // Set up Route53 aliases records for the CloudFront distribution. i.e. point the app domain to CloudFront.
                    new route53.ARecord(this, 'ARecord', {
                        zone,
                        target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(hostingCloudFront.distribution)),
                        recordName: app.name
                    });

                    const pipelineS3 = new jompx.AppPipelineS3(this, `AppPipelineS3${appNamePascalCase}`);

                    const codebuildBuildSpecObject = {
                        version: 0.2,
                        env: {
                            variables: {
                                STAGE: `${stage}`,
                                BUCKET_NAME: `${hostingS3.bucket.bucketName}`,
                                APP_NAME: `${app.name}`
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
                        appName: app.name,
                        hostingBucket: hostingS3.bucket,
                        pipelinegBucket: pipelineS3.bucket,
                        gitHub: {
                            owner: 'matthew-valenti',
                            repo: 'jompx-org',
                            token: cdk.SecretValue.secretsManager('/cicd/github/token')
                        },
                        codebuildBuildSpecObject
                    });
                }
            });
        }
    }
}