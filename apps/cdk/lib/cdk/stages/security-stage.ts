import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SecurityStack } from '@cdk/lib/cdk/stacks/security-stack';

/*
    Security AWS account resources.
*/
export class SecurityStage extends cdk.Stage {

    constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);

        new SecurityStack(this, 'SecurityStack', props);
    }
}
