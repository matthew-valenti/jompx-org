import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from "constructs";
import * as jompx from '@jompx/constructs';
import { AppSyncBuild } from '@cdk/lib/app-sync/build.construct';
import { AppSyncBusiness } from '@cdk/lib/app-sync/business.construct';

export enum AppSyncDatasource {
    mySql = 'mySql',
    cognito = 'cognito'
}

export interface AppSyncStackProps extends cdk.StackProps {
    userPool: cdk.aws_cognito.UserPool;
}

export class AppSyncStack extends cdk.Stack {

    public graphqlApi: appsync.GraphqlApi;
    public schemaBuilder: jompx.AppSyncSchemaBuilder;

    constructor(scope: Construct, id: string, props: AppSyncStackProps) {
        super(scope, id, props);

        // Create AppSync resource.
        const appSync = new jompx.AppSync(this, 'AppSync', {
            name: 'api',
            additionalAuthorizationModes: [
                {
                    authorizationType: appsync.AuthorizationType.USER_POOL,
                    userPoolConfig: { userPool: props.userPool }
                }
            ]
        });

        this.graphqlApi = appSync.graphqlApi;
        this.schemaBuilder = appSync.schemaBuilder;

        // Add MySQL datasource.
        const appSyncMySqlDataSource = new jompx.AppSyncMySqlDataSource(this, AppSyncDatasource.mySql, { lambdaFunctionProps: { memorySize: 128 * 2 } });
        this.schemaBuilder.addDataSource(AppSyncDatasource.mySql, appSyncMySqlDataSource.lambdaFunction);

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
    }
}