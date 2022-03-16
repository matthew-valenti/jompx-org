import { Stack, StackProps, SecretValue } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as changeCase from 'change-case';
import * as jompx from '@jompx/constructs';
import { CdkAppStage } from './cdk-app-stage';

export class CdkPipelineBranchStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // const config = new jompx.Config(this.node);

        // const jompxCdkPipelineBranchProps: jompx.ICdkPipelineBranchProps = {
        //     environmentNameSubstring: 'sandbox',
        //     gitHubOwner: 'matthew-valenti',
        //     gitHubRepo: 'jompx-org',
        //     // shellStepInput: pipelines.CodePipelineSource.gitHub(
        //     //     'matthew-valenti/jompx-org',
        //     //     stage === 'prod' ? 'main' : 'pipeline', // TODO: change pipeline branch to: test
        //     //     { authentication: SecretValue.secretsManager('cicd/github/token') }
        //     // )
        // };

        // // Create CDK CodePipeline.
        // const cdkPipelineBranch = new jompx.CdkPipelineBranch(this, 'JompxCdkPipeline', jompxCdkPipelineBranchProps);

        // cdkPipelineBranch.environmentPipelines.forEach((environmentPipeline) => {
        //     const environment = environmentPipeline.environment;
        //     environmentPipeline.pipeline.addStage(new CdkAppStage(this, `CdkAppStage${changeCase.pascalCase(environment.name)}`, { ...props, env: config.env('cdk', environment.name) })); // Always deploy to sandbox environment.
        // });
    }
}