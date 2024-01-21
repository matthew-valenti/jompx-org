import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as appsyncUtils from 'awscdk-appsync-utils';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as jompx from '@jompx/constructs';

// Business.
import { PostSchema } from '@cdk/lib/post/post.construct';

export interface AppSyncSubscriptionProps extends cdk.StackProps {
    codeFirstSchema: appsyncUtils.CodeFirstSchema,
    schemaBuilder: jompx.AppSyncSchemaBuilder;
}

export class AppSyncSubscription extends Construct {

    constructor(scope: Construct, id: string, props: AppSyncSubscriptionProps) {
        super(scope, id);

        if (props?.schemaBuilder) {

            props.codeFirstSchema.addSubscription('dMovieUpdated', new appsyncUtils.Field({
                returnType: props.schemaBuilder.schemaTypes.objectTypes['UpdateOneOutput'].attribute(),
                // Filter subscriptions with args e.g. subscribe to movie updates for a speicifc movie id.
                // args: {
                //     id: appsync.GraphqlType.id({ isRequired: true })
                // },
                directives: [appsyncUtils.Directive.subscribe('dMovieUpdateOne')] // TODO: How do we handle upserts that create (not update).
            }));
        }
    }
}
