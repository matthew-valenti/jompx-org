import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
// import * as jompx from '@jompx/constructs';

export class DynamoDbStack extends cdk.Stack {

    // public tables: cdk.aws_dynamodb.Table[] = [];

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // const config = new Config(this.node); 

        // const auroraServerlessVersion1 = new jompx.AuroraServerlessVersion1(this, 'AuroraServerlessVersion1MySql', {
        //     clusterIdentifier: '',
        //     engine: cdk.aws_rds.IClusterEngine;
        // });
    }
}
