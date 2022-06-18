import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as jompx from '@jompx/constructs';

// Business.
import { PostSchema } from '@cdk/lib/post/post-schema.construct';

export interface AppSyncBuildProps extends cdk.StackProps {
    graphqlApi: appsync.GraphqlApi;
    schemaBuilder: jompx.AppSyncSchemaBuilder;
}

export class AppSyncBusiness extends Construct {

    constructor(scope: Construct, id: string, props: AppSyncBuildProps) {
        super(scope, id);

        if (props?.schemaBuilder) {
            new PostSchema(this, 'PostSchema', { schemaBuilder: props.schemaBuilder });
        }
    }
}
