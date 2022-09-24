import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import { AppSyncStack } from '@cdk/lib/cdk/stacks/app-sync.stack';
import { CognitoStack } from '@cdk/lib/cdk/stacks/cognito-stack';
import { DynamoDbStack } from '@cdk/lib/cdk/stacks/dynamo-db.stack';
import { HostingStack } from '@cdk/lib/cdk/stacks/hosting-stack';

export class AppStage extends cdk.Stage {

    constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);

        new HostingStack(this, 'HostingStack', {});

        const cognitoStack = new CognitoStack(this, 'CognitoStack', props);

        const dynamoDbStack = new DynamoDbStack(this, 'DynamoDbStack', {});

        new AppSyncStack(this, 'AppSyncStack', {
            userPool: cognitoStack.userPool,
            dataSourceStack: {
                dynamoDbStack
            }
        });
    }
}