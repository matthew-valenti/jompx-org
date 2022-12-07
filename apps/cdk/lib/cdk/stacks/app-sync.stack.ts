import * as path from 'path';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import * as jconstructs from '@jompx/constructs';
import * as jmysql from '@jompx/mysql-datasource';
import * as jdynamodb from '@jompx/dynamodb-datasource';
import { DynamoDbStack } from './dynamo-db.stack';
import { AppSyncBuild } from '@cdk/lib/app-sync/build.construct';
import { AppSyncBusiness } from '@cdk/lib/app-sync/business.construct';
import { AppSyncSubscription } from '@cdk/lib/app-sync/subscription.construct';

export interface AppSyncStackProps extends cdk.StackProps {
    userPool: cdk.aws_cognito.UserPool;
    dataSourceStack: {
        dynamoDbStack: DynamoDbStack
    }
}

export class AppSyncStack extends cdk.Stack {

    public graphqlApi: appsync.GraphqlApi;
    public schemaBuilder: jconstructs.AppSyncSchemaBuilder;

    constructor(scope: Construct, id: string, props: AppSyncStackProps) {
        super(scope, id, props);

        // Create AppSync resource.
        const appSync = new jconstructs.AppSync(this, 'AppSync', {
            name: 'api',
            additionalAuthorizationModes: [
                {
                    authorizationType: appsync.AuthorizationType.USER_POOL,
                    userPoolConfig: { userPool: props.userPool }
                },
                {
                    authorizationType: appsync.AuthorizationType.API_KEY,
                    apiKeyConfig: {
                        expires: cdk.Expiration.after(cdk.Duration.days(365)),
                    }
                }
            ]
        });

        this.graphqlApi = appSync.graphqlApi;
        this.schemaBuilder = appSync.schemaBuilder;

        // Add MySQL datasource.
        const jompxMySqlDataSource = new jmysql.AppSyncMySqlDataSourceConstruct(this, 'mySql', { // TODO: Not thrilled about having the name construct here!!??
            graphqlSchema: {
                filePathJson: path.join(process.cwd(), '..', '..', 'schema.graphql.json'), // OS safe path to file.
                directivesFilePathJson: path.join(process.cwd(), '..', '..', 'schema.graphql.directives.json'), // OS safe path to file.
                // filePathJson: path.join(__dirname, '..', '..', '..', '..', '..', 'schema.graphql.json'), // OS safe path to file. // Array(5).fill(..)
                // directivesFilePathJson: path.join(__dirname, '..', '..', '..', '..', '..', 'schema.graphql.directives.json'), // OS safe path to file. // Array(5).fill(..)
            },
            lambdaFunctionProps: { memorySize: 128 * 2 },
            options: {}
        });
        this.schemaBuilder.addDataSource('mySql', jompxMySqlDataSource.lambdaFunction);

        // Add DynamoDb datasource.
        const jompxDynamoDbDataSource = new jdynamodb.AppSyncDynamoDbDataSourceConstruct(this, 'dynamoDb', { // TODO: Not thrilled about having the name construct here!!??
            graphqlSchema: {
                filePathJson: path.join(process.cwd(), '..', '..', 'schema.graphql.json'), // OS safe path to file.
                directivesFilePathJson: path.join(process.cwd(), '..', '..', 'schema.graphql.directives.json'), // OS safe path to file.
                // filePathJson: path.join(__dirname, '..', '..', '..', '..', '..', 'schema.graphql.json'), // OS safe path to file. // Array(5).fill(..)
                // directivesFilePathJson: path.join(__dirname, '..', '..', '..', '..', '..', 'schema.graphql.directives.json'), // OS safe path to file. // Array(5).fill(..)
            },
            lambdaFunctionProps: { memorySize: 128 * 2 },
            options: {}
        });
        this.schemaBuilder.addDataSource('dynamoDb', jompxDynamoDbDataSource.lambdaFunction);

        // Security: Grant the DynamoDb Lambda datasource read/write access to all DynamoDb tables.
        props.dataSourceStack.dynamoDbStack.tables.forEach(table => {
            table.grantReadWriteData(jompxDynamoDbDataSource.lambdaFunction);
        });

        // Add auto build GraphQL endpoints.
        new AppSyncBuild(this, 'AppSyncBuild', {
            graphqlApi: this.graphqlApi,
            schemaBuilder: this.schemaBuilder
        });

        // Add business GraphQL endpoints.
        new AppSyncBusiness(this, 'AppSyncBusiness', {
            graphqlApi: this.graphqlApi,
            schemaBuilder: this.schemaBuilder
        });

        // Add subscriptions.
        new AppSyncSubscription(this, 'AppSyncSubscription', {
            graphqlApi: this.graphqlApi,
            schemaBuilder: this.schemaBuilder
        });
    }
}
