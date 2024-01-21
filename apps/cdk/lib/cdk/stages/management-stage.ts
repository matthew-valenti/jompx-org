import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ManagementStack } from '@cdk/lib/cdk/stacks/management-stack';

/*
    Management (or organization) AWS account resources.
*/
export class ManagementStage extends cdk.Stage {

    constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);

        new ManagementStack(this, 'ManagementStack', props);
    }
}
