import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import { AppSyncStack } from './app-sync.stack';
import { CognitoStack } from './cognito';
import { HostingStack } from './hosting-stack';

export class CdkAppStage extends cdk.Stage {

    constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);

        new HostingStack(this, 'HostingStack', {});

        const cognitoStack = new CognitoStack(this, 'CognitoStack', props);

        new AppSyncStack(this, 'AppSyncStack', {
            userPool: cognitoStack.userPool
        });
    }
}