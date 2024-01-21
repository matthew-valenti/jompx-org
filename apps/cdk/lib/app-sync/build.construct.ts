import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as jompx from '@jompx/constructs';

// Build.
import { MySqlSchema } from '@cdk/lib/app-sync/schema/mysql.schema';
import { DynamoDbSchema } from '@cdk/lib/app-sync/schema/dynamo-db.schema';

export interface AppSyncBusinessProps extends cdk.StackProps {
    graphqlApi: appsync.GraphqlApi;
    schemaBuilder: jompx.AppSyncSchemaBuilder;
}

export class AppSyncBuild extends Construct {

    constructor(scope: Construct, id: string, props: AppSyncBusinessProps) {
        super(scope, id);

        if (props?.schemaBuilder) {

            // Add MySQL schema.
            const mySqlSchema = new MySqlSchema(props.schemaBuilder.dataSources);
            props.schemaBuilder.addSchemaTypes(mySqlSchema.types);

            // Add DynamoDb schema.
            const dynamoDbSchema = new DynamoDbSchema(props.schemaBuilder.dataSources);
            props.schemaBuilder.addSchemaTypes(dynamoDbSchema.types);

            // Auto build GraphQL endpoints from schema.
            props.schemaBuilder.create();
        }
    }
}
