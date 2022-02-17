import { Stack, StackProps, SecretValue } from 'aws-cdk-lib';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
// Construct does not synth. Reason unknown. Have spent days trying to fix this. Move construct file to local (for now).
import { JompxCdkPipeline, IJompxCdkPipelineProps } from './cdk-pipeline-construct';
// import { JompxCdkPipeline, IJompxCdkPipelineProps } from '@jompx/constructs'; 
import { CdkAppStage } from './cdk-app-stage';
import { ManualApprovalAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { pipeline } from 'stream';

export class CdkPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const jompxCdkPipelineProps: IJompxCdkPipelineProps = {
            shellStepInput: pipelines.CodePipelineSource.gitHub(
                'matthew-valenti/jompx-org',
                'pipeline',
                { authentication: SecretValue.secretsManager('cicd/github/token') }
            ),
        };

        const cdkPipeline = new JompxCdkPipeline(this, 'JompxCdkPipeline', jompxCdkPipelineProps);
        const stage = cdkPipeline.pipeline.addStage(new CdkAppStage(this, 'CdkAppStage', { ...props, ...{ env: { account: '066209653567', region: 'us-west-2' } } }));
    }
}
