import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CommunicationStack } from '@cdk/lib/cdk/stacks/communication-stack';
import { NetworkStack } from '@cdk/lib/cdk/stacks/network-stack';

/*
    Resources common across all accounts.
*/
export class CommonStage extends cdk.Stage {

    constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);

        new CommunicationStack(this, 'CommunicationStack', props);
        new NetworkStack(this, 'NetworkStack', props);
    }
}
