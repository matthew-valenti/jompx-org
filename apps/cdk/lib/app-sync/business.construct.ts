import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as jompx from '@jompx/constructs';

// Build.
import { MySqlSchema } from '@cdk/lib/app-sync/schema/mysql.schema';

export interface AppSyncBuildProps extends cdk.StackProps {
    graphqlApi: appsync.GraphqlApi;
    schemaBuilder: jompx.AppSyncSchemaBuilder;
}

export class AppSyncBusiness extends Construct {

    constructor(scope: Construct, id: string, props: AppSyncBuildProps) {
        super(scope, id);

        if (props?.schemaBuilder) {

            // Add MySQL schema.
            const mySqlSchema = new MySqlSchema(props.schemaBuilder.dataSources);
            props.schemaBuilder.addSchemaTypes(mySqlSchema.types);

            // Auto build GraphQL endpoints from schema.
            props.schemaBuilder.create();
        }
    }
}
