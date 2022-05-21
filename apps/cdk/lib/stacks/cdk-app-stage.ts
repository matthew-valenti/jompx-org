import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import { AppSyncStack } from './app-sync.stack';
import { CognitoStack } from './cognito';

export class CdkAppStage extends cdk.Stage {

    constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);

        const cognitoStack = new CognitoStack(this, 'CognitoStack', props);

        new AppSyncStack(this, 'AppSyncStack', {
            userPool: cognitoStack.userPool
        });
    }
}