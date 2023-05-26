// import * as url from 'url';
// import * as path from 'path';
// import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
// import * as jompx from '@jompx/constructs';
// import { AppSyncBuild } from '@cdk/lib/app-sync/build.construct';
// import { AppSyncBusiness } from '@cdk/lib/app-sync/business.construct';

export class DynamoDbStack extends cdk.Stack {

    public tables: cdk.aws_dynamodb.Table[] = [];

    // public graphqlApi: appsync.GraphqlApi;
    // public schemaBuilder: jompx.AppSyncSchemaBuilder;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-modeling-nosql-B.html
        const movieTable = new dynamodb.Table(this, 'Movie', {
            tableName: 'movie',
            removalPolicy: cdk.RemovalPolicy.DESTROY, // Set to retain for real projects.
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
            // sortKey: { name: 'name', type: dynamodb.AttributeType.STRING }
        });
        this.tables.push(movieTable);

        movieTable.addGlobalSecondaryIndex({
            indexName: 'movieIndex',
            partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
            projectionType: dynamodb.ProjectionType.INCLUDE,
            nonKeyAttributes: [
                'boolean',
                'float',
                'decimal',
                'int',
                'date',
                'dateTime',
                'email',
                'ipAddress',
                'phone',
                'time',
                'timestamp',
                'url',
                'sourceField',
                'list',
                'attributes',
                'owners',
                'groups'
            ]
        });

        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-modeling-nosql-B.html
        const movieActor = new dynamodb.Table(this, 'MovieActor', {
            tableName: 'movieActor',
            removalPolicy: cdk.RemovalPolicy.DESTROY, // Set to retain for real projects.
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
            // sortKey: { name: 'name', type: dynamodb.AttributeType.STRING }
        });
        this.tables.push(movieActor);
    }
}
