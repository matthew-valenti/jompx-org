import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from "constructs";
import * as jompx from '@jompx/constructs';

// Schema
import { MySqlSchema } from '@cdk/lib/app-sync/schema/mysql.schema';
import { AppSyncBusiness } from '@cdk/lib/app-sync/business.construct';

export enum AppSyncDatasource {
    mySql = 'mySql',
    cognito = 'cognito'
}

export class AppSyncStack extends cdk.Stack {

    public graphqlApi: appsync.GraphqlApi;
    public schemaBuilder: jompx.AppSyncSchemaBuilder;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create AppSync resource.
        const appSync = new jompx.AppSync(this, 'AppSync', {});
        this.graphqlApi = appSync.graphqlApi;
        this.schemaBuilder = appSync.schemaBuilder;

        // Add MySQL datasource.
        const appSyncMySqlDataSource = new jompx.AppSyncMySqlDataSource(this, AppSyncDatasource.mySql, {});
        this.schemaBuilder.addDataSource(AppSyncDatasource.mySql, appSyncMySqlDataSource.lambdaFunction);

        // Add MySQL schema.
        const mySqlSchema = new MySqlSchema(this.schemaBuilder.dataSources);
        this.schemaBuilder.addSchemaTypes(mySqlSchema.types);

        // Auto create schema CRUD.
        this.schemaBuilder.create();

        // Add business schema.
        new AppSyncBusiness(this, 'AppSyncBusiness', {
            graphqlApi: this.graphqlApi,
            schemaBuilder: this.schemaBuilder
        });

        new ssm.StringParameter(this, 'AppSyncGraphqlUrl', {
            parameterName: '/appSync/graphqlUrl',
            stringValue: this.graphqlApi.graphqlUrl
        });
    }
}