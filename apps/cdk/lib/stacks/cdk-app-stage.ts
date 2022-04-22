import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import { AppSyncStack } from './app-sync.stack';

export class CdkAppStage extends cdk.Stage {

    constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);

        new AppSyncStack(this, 'AppSyncStack', props);
    }
}