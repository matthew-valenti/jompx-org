import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as jompx from '@jompx/constructs';
import { Config } from '@jompx-org/config';

export class DynamoDbStack extends cdk.Stack {

    // public tables: cdk.aws_dynamodb.Table[] = [];

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const config = new Config(this.node);

        // const auroraServerlessVersion1 = new jompx.AuroraServerlessVersion1(this, 'AuroraServerlessVersion1MySql', {
        //     clusterIdentifier: 'jompx-org',
        //     engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_02_1 }),
        //     vpc: '',
        //     useKmsEncryptionKey: false,
        //     defaultDatabaseName: `aurora-serverless-1-mysql-${config.env}`
        // });

        // // Create a secret username and password for general access by other services. Security best practice is not to use the database admin user for general access.
        // const serviceUserDatabaseSecret = new rds.DatabaseSecret(this, 'ServiceUserDatabaseSecret', {
        //     username: 'service',
        //     secretName: 'auroraServerlessVersion1/mysql/service'
        // });
        // serviceUserDatabaseSecret.attach(auroraServerlessVersion1); // Adds DB connections information to the secret.
    }
}
