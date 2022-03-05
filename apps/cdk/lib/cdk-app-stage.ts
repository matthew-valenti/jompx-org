import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import { LambdaStack } from './lambda-stack';

export class CdkAppStage extends cdk.Stage {

    constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);

        console.log('!!!!!!!!!!!!!!!!!!iamhere!!!!!!!!!!!!!!!!!!!')

        const lambdaStack = new LambdaStack(this, 'MyFirstLambdaStack', props);
    }
}