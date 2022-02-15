import { Stack, StackProps, SecretValue } from 'aws-cdk-lib';
import { CodePipelineSource } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
// Construct does not synth. Reason unknown. Have spent days trying to fix this. Move construct file to local (for now).
import { JompxCdkPipeline, IJompxCdkPipelineProps } from './cdk-pipeline-construct';
// import { JompxCdkPipeline, IJompxCdkPipelineProps } from '@jompx/constructs'; 

export class CdkPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const jompxCdkPipelineProps: IJompxCdkPipelineProps = {
            shellStepInput: CodePipelineSource.gitHub(
                'matthew-valenti/jompx-org',
                'pipeline',
                { authentication: SecretValue.secretsManager('cicd/github/token') }
            )
        };

        new JompxCdkPipeline(this, 'JompxCdkPipeline', jompxCdkPipelineProps);

        // cdkPipeline.pipeline.addStage(new PipelineStage(this, "test", {
        //     env: { account: "066209653567", region: "us-west-2" }
        // }));
    }
}
