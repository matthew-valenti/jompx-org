import { Stack, StackProps, SecretValue } from 'aws-cdk-lib';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
// Construct does not synth when package.json dependency is file. Move construct file to local (local development workaround).
// import { JompxCdkPipeline, IJompxCdkPipelineProps } from './xxxcdk-pipeline-construct';
import { Environment, JompxCdkPipeline, IJompxCdkPipelineProps } from '@jompx/constructs'; 
import { CdkAppStage } from './cdk-app-stage';

export class CdkPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const environment = new Environment(this.node.tryGetContext('@jompx').environments);
        const stage = environment.getByAccountId(props?.env?.account!)?.stage;
        console.log('stage', stage);

        const jompxCdkPipelineProps: IJompxCdkPipelineProps = {
            shellStepInput: pipelines.CodePipelineSource.gitHub(
                'matthew-valenti/jompx-org',
                stage === 'prod' ? 'main' : 'pipeline', // TODO: change pipeline branch to: test
                { authentication: SecretValue.secretsManager('cicd/github/token') }
            )
        };

        // Create CDK CodePipeline.
        const cdkPipeline = new JompxCdkPipeline(this, 'JompxCdkPipeline', jompxCdkPipelineProps);

        // On main branch changes, deploy to prod accounts (via test accounts).
        if (stage === 'prod') {
            // Main CDK app stage(s) to prod and test.
            cdkPipeline.pipeline.addStage(new CdkAppStage(this, 'CdkAppStageTest', { ...props, env: environment.getEnv('test') }));
            cdkPipeline.pipeline.addStage(new CdkAppStage(this, 'CdkAppStageProd', { ...props, env: environment.getEnv('prod') }));

            // Common CDK app stage(s) to prod and test.

            // Add an optional manual approval step. Manual approval is required in AWS CodePipeline (in CdkAppStageProd stage).
            // pipelineStage.addPre(new pipelines.ManualApprovalStep('approval'));
        }

        // On test branch changes, deploy to test accounts.
        if (stage === 'test') {
            // Main CDK app stage(s) to test.
            cdkPipeline.pipeline.addStage(new CdkAppStage(this, 'CdkAppStageTest', { ...props, env: environment.getEnv('test') }));

            // Common CDK app stage(s) to test.
        }

        // 3. Deploy frontend apps. Wave? But what if CDK fails (which is more likely than app)? Probably need to do sync.
    }
}
