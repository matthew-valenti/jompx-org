import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as lambdanjs from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as jompx from '@jompx/constructs';

export class AppSyncDatasourcePreTrigger extends Construct {
    public lambdaFunction: cdk.aws_lambda.IFunction;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id);

        this.lambdaFunction = new lambdanjs.NodejsFunction(this, 'pre-handler', {
            ...jompx.DatasourceLambdaDefaultProps,
            memorySize: 128,
            description: `AppSync datasource pre-trigger.`,
        });
    }
}