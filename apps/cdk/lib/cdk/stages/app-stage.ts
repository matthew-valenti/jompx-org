import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import { AppSyncStack } from '@cdk/lib/cdk/stacks/app-sync.stack';
import { CognitoStack } from '@cdk/lib/cdk/stacks/cognito';
import { HostingStack } from '@cdk/lib/cdk/stacks/hosting-stack';

export class AppStage extends cdk.Stage {

    constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);

        new HostingStack(this, 'HostingStack', {});

        const cognitoStack = new CognitoStack(this, 'CognitoStack', props);

        new AppSyncStack(this, 'AppSyncStack', {
            userPool: cognitoStack.userPool
        });
    }
}