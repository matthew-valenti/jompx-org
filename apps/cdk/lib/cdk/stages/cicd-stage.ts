import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CommunicationStack } from '@cdk/lib/cdk/stacks/communication-stack';
// import { AppsPipelineStack } from '@cdk/lib/cdk/stacks/apps-pipeline-stack';

/*
    Resources common across all accounts.
*/
export class CiCdStage extends cdk.Stage {

    constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);

        new CommunicationStack(this, 'CommunicationStack', props);
        // TODO: Use or lose.
        // new AppsPipelineStack(this, 'AppsPipelineStack', props);
    }
}
