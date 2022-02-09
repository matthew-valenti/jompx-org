import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import {
//   CodePipeline,
//   CodePipelineSource,
//   ShellStep,
// } from 'aws-cdk-lib/pipelines';
// import { PipelineStage } from './pipeline-stage';
// import {
//   JompxCdkPipeline,
//   JompxCdkPipelineProps,
// } from './cdk-pipeline-construct';
import { JompxCdkPipeline, IJompxCdkPipelineProps } from '@jompx/constructs';

export class CdkPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new JompxCdkPipeline(this, 'JompxCdkPipeline', { test: 'testmatthew' });

    // const pipeline = new CodePipeline(this, 'Pipeline', {
    //     pipelineName: 'CdkPipeline',
    //     crossAccountKeys: true, // Required for cross account deploys.
    //     synth: new ShellStep('Synth', {
    //         input: CodePipelineSource.gitHub('matthew-valenti/jompx-org', 'ci', {
    //             // authentication: cdk.SecretValue.ssmSecure('/cicd/github/token', '1')
    //             authentication: cdk.SecretValue.secretsManager('cicd/github/token')
    //         }), // AWS Secrets: github-token
    //         // commands: ['npm ci', 'npm run build', 'npx cdk synth']
    //         commands: ['npm ci', 'nx build cdk', 'nx synth cdk']
    //     })
    // });

    // cdkPipeline.pipeline.addStage(new PipelineStage(this, "test", {
    //     env: { account: "066209653567", region: "us-west-2" }
    // }));
  }
}
