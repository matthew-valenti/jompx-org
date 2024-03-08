import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NetworkStack } from '@cdk/lib/cdk/stacks/network-stack';

/*
    Management (or organization) AWS account resources.
*/
export class NetworkStage extends cdk.Stage {

    constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);

        new NetworkStack(this, 'NetworkStack', props);
    }
}
