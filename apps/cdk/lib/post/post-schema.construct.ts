import { AppSyncLambdaDefaultProps } from '@jompx/constructs';
import { Construct } from 'constructs';
import { GraphqlType, InputType, ObjectType } from '@aws-cdk/aws-appsync-alpha';
import * as lambdanjs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as jompx from '@jompx/constructs';

export interface PostSchemaProps {
    schemaBuilder: jompx.AppSyncSchemaBuilder
}

/**
 * Add datasource.
 * Create one method per AppSync operation.
 */
export class PostSchema extends Construct {

    private props: PostSchemaProps;

    constructor(scope: Construct, id: string, props: PostSchemaProps) {
        super(scope, id);
        this.props = props;

        this.addDataSource(); // Or skip and specify an existing datasource name.
        this.mpostBusiness();
    }

    private addDataSource() {

        const lambdaFunction = new lambdanjs.NodejsFunction(this, 'handler', {
            ...{ AppSyncLambdaDefaultProps },
            description: `AppSync post handler.`
        });

        this.props.schemaBuilder.addDataSource('post', lambdaFunction);
    }

    /**
     * 1. Define inputs args.
     * 2. Define return type and include directives (e.g. security).
     * 3. Call create operation.
     */
    private mpostBusiness() {

        const args = {
            number3: GraphqlType.int({ isRequired: true }),
            number1: GraphqlType.int({ isRequired: true }),
            number2: GraphqlType.int({ isRequired: true })
        };

        const returnType = new ObjectType('MPostBusiness', {
            definition: {
                number3: GraphqlType.int({ isRequired: true }),
                number1: GraphqlType.int({ isRequired: true }),
                number2: GraphqlType.int({ isRequired: true }),
                result: GraphqlType.int({ isRequired: true })
            },
            directives: [
                // CustomDirective.permissions(['read', 'create', 'update', 'delete'])
            ]
        });

        this.props.schemaBuilder?.addMutation({ name: 'mpostBusiness', dataSourceName: 'post', args, returnType, methodName: 'business' });
    }
}
