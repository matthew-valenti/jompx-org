import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from "constructs";
import * as jompx from '@jompx/constructs';

export class CognitoStack extends cdk.Stack {

    public userPool: cognito.UserPool;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create Cognito resource.
        const jompxCognito = new jompx.Cognito(this, 'Cognito', {
            name: 'apps',
            appCodes: ['admin']
        });
        this.userPool = jompxCognito.userPool;

        // Create Cognito user pool groups.

        new cognito.CfnUserPoolGroup(this, 'AdminGroup', {
            groupName: 'admin',
            userPoolId: this.userPool.userPoolId
        });
    }
}