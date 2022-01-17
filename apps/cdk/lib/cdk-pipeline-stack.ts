import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { PipelineStage } from './pipeline-stage';

export class CdkPipelineStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'CdkPipeline',
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.gitHub('https://github.com/matthew-valenti/jompx-org.git', 'ci'),
                commands: ['npm ci', 'npm run build', 'npx cdk synth']
            })
        });

        pipeline.addStage(new PipelineStage(this, "test", {
            env: { account: "066209653567", region: "us-west-2" }
        }));
    }
}