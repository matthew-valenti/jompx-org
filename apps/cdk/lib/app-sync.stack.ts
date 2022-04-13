import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import * as jompx from '@jompx/constructs';

// Schema
import { MySqlSchema } from '../lib/app-sync/schema/mysql.schema';

export enum AppSyncDatasource {
    mySql = 'mySql',
    cognito = 'cognito'
}

export class AppSyncStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create AppSync resource.
        const appSync = new jompx.AppSync(this, 'AppSync', {});

        // Add MySQL datasource.
        const appSyncMySqlDataSource = new jompx.AppSyncMySqlDataSource(this, AppSyncDatasource.mySql, {});
        appSync.addDataSource(AppSyncDatasource.mySql, appSyncMySqlDataSource.lambdaFunction);

        // Add MySQL schema.
        const mySqlSchema = new MySqlSchema(appSync.dataSources);
        appSync.addSchemaTypes(mySqlSchema.types);

        appSync.createSchema();
    }
}