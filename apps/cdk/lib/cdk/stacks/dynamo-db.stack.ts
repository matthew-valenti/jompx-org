// import * as url from 'url';
// import * as path from 'path';
// import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
// import * as jompx from '@jompx/constructs';
// import { AppSyncBuild } from '@cdk/lib/app-sync/build.construct';
// import { AppSyncBusiness } from '@cdk/lib/app-sync/business.construct';

export interface DynamoDbProps extends cdk.StackProps {
    // userPool: cdk.aws_cognito.UserPool;
}

export class DynamoDbStack extends cdk.Stack {

    public tables: cdk.aws_dynamodb.Table[] = [];

    // public graphqlApi: appsync.GraphqlApi;
    // public schemaBuilder: jompx.AppSyncSchemaBuilder;

    constructor(scope: Construct, id: string, props: DynamoDbProps) {
        super(scope, id, props);

        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-modeling-nosql-B.html
        const movieTable = new dynamodb.Table(this, 'Movie', {
            tableName: 'movie',
            removalPolicy: cdk.RemovalPolicy.DESTROY, // TODO: Set to retain after POC complete.
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING }
            // sortKey: { name: 'name', type: dynamodb.AttributeType.STRING }
        });
        this.tables.push(movieTable);

        // // Create AppSync resource.
        // const appSync = new jompx.AppSync(this, 'AppSync', {
        //     name: 'api',
        //     additionalAuthorizationModes: [
        //         {
        //             authorizationType: appsync.AuthorizationType.USER_POOL,
        //             userPoolConfig: { userPool: props.userPool }
        //         }
        //     ]
        // });

        // this.graphqlApi = appSync.graphqlApi;
        // this.schemaBuilder = appSync.schemaBuilder;

        // // Add MySQL datasource.
        // const jompxMySqlDataSource = new jmysql.AppSyncMySqlDataSourceConstruct(this, AppSyncDatasource.mySql, { // TODO: Not thrilled about having the name construct here!!??
        //     graphqlSchema: {
        //         filePathJson: path.join(__dirname, '..', '..', '..', '..', '..', 'schema.graphql.json'), // OS safe path to file. // Array(5).fill(..)
        //         directivesFilePathJson: path.join(__dirname, '..', '..', '..', '..', '..', 'schema.graphql.directives.json'), // OS safe path to file. // Array(5).fill(..)
        //     },
        //     lambdaFunctionProps: { memorySize: 128 * 2 }
        // });
        // this.schemaBuilder.addDataSource(AppSyncDatasource.mySql, jompxMySqlDataSource.lambdaFunction);

        // // Add auto build GraphQL endpoints.
        // new AppSyncBuild(this, 'AppSyncBuild', {
        //     graphqlApi: this.graphqlApi,
        //     schemaBuilder: this.schemaBuilder
        // });

        // // Add business GraphQL endpoints.
        // new AppSyncBusiness(this, 'AppSyncBusiness', {
        //     graphqlApi: this.graphqlApi,
        //     schemaBuilder: this.schemaBuilder
        // });
    }
}
