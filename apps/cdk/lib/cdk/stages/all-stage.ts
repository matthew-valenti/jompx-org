import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import { CommunicationStack } from '@cdk/lib/cdk/stacks/communication-stack';

export class AllStage extends cdk.Stage {

    constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);

        new CommunicationStack(this, 'CommunicationStack', props);
    }
}
