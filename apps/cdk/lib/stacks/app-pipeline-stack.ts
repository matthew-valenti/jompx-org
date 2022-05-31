// import * as cdk from 'aws-cdk-lib';
// import { Construct } from 'constructs';
// import * as jompx from '@jompx/constructs';
// import * as changeCase from 'change-case';

// export class AppPipelineStack extends cdk.Stack {

//     public props: cdk.StackProps | undefined;

//     constructor(scope: Construct, id: string, props?: cdk.StackProps) {
//         super(scope, id, props);
//         this.props = props;

//         const config = new jompx.Config(this.node);
//         const stage = config.stage();

//         const domainName = 'jompx.com'; // TODO: Move to config? What about multiple domain names?
//         const appNames = ['admin']; // TODO: Move to config?

//         appNames.forEach(appName => {
//             const appNamePascalCase = changeCase.pascalCase(appName);

//             const bucketName = stage === 'prod' ? `${appName}.${domainName}` : `arn:aws:s3:::${appName}.${stage}.${domainName}`;

//             const codebuildBuildSpecObject = {
//                 version: 0.2,
//                 env: {
//                     variables: {
//                         STAGE: `${stage}`,
//                         BUCKET_NAME: `${bucketName}`,
//                         APP_NAME: `${appName}`
//                     }
//                 },
//                 phases: {
//                     install: {
//                         commands: [
//                             'npm ci',
//                             'npm install -g @angular/cli > /dev/null',
//                             'npm install -g @ionic/cli',
//                             'npm install -g @aws-amplify/cli'
//                         ]
//                     },
//                     build: {
//                         commands: [
//                             'echo STAGE=$STAGE',
//                             'echo APP_NAME=$APP_NAME',
//                             'ionic build --project $APP_NAME'
//                             // 'ionic build --project $APP_NAME --configuration=$STAGE'
//                         ]
//                     },
//                     post_build: {
//                         commands: [
//                             'if [ $CODEBUILD_BUILD_SUCCEEDING = 1 ]; then aws s3 sync "apps/$APP_NAME/www/" "s3://$BUCKET_NAME/" --delete" --quiet; fi'
//                         ]
//                     }
//                 }
//             };

//             new jompx.AppPipeline(this, `AppPipeline${appNamePascalCase}`, {
//                 stage,
//                 domainName,
//                 appName,
//                 gitHub: {
//                     owner: 'matthew-valenti',
//                     repo: 'jompx-org',
//                     token: cdk.SecretValue.secretsManager('cicd/github/token')
//                 },
//                 codebuildBuildSpecObject
//             });
//         });
//     }
// }