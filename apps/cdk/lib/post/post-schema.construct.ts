import * as cdk from 'aws-cdk-lib';
import * as lambdanjs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { AppSyncLambdaDefaultProps } from '@jompx/constructs';
import { Construct } from 'constructs';
import { GraphqlType, InputType, ObjectType } from '@aws-cdk/aws-appsync-alpha';
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
        this.mpostBusinessGraphql();
    }

    private addDataSource() {

        // TODO: Implement Aspect and auto pass variables to all business Lambdas. https://docs.aws.amazon.com/cdk/v2/guide/aspects.html
        const lambdaFunction = new lambdanjs.NodejsFunction(this, 'handler', {
            ...AppSyncLambdaDefaultProps,
            memorySize: 128 * 2,
            description: `AppSync post handler.`,
            // environment: {
            //     graphqlUrl: ssm.StringParameter.valueForStringParameter(this, '/appSync/graphqlUrl2')
            // }
        });

        // TODO: Lock down permissions.
        lambdaFunction.addToRolePolicy(new cdk.aws_iam.PolicyStatement({
            actions: ['appsync:GraphQL'],
            resources: ['*']
        }));

        this.props.schemaBuilder.addDataSource('post', lambdaFunction);
    }

    private mpostBusinessGraphql() {

        const mutationName = 'mpostBusinessGraphql';

        const args = {
            number1: GraphqlType.int({ isRequired: true })
        };

        const returnType = new ObjectType(mutationName, {
            definition: {
                id: GraphqlType.string({ isRequired: true })
            },
            directives: [
                // CustomDirective.permissions(['read', 'create', 'update', 'delete'])
            ]
        });

        this.props.schemaBuilder?.addMutation({ name: mutationName, dataSourceName: 'post', args, returnType, methodName: 'businessGraphql' });
    }

    /**
     * 1. Define inputs args.
     * 2. Define return type and include directives (e.g. security).
     * 3. Call create operation.
     */
    private mpostBusiness() {

        const args: jompx.AppSyncIFields = {
            number3: GraphqlType.int({ isRequired: true }),
            number1: GraphqlType.int({ isRequired: true }),
            number2: GraphqlType.int({ isRequired: true }),
        }

        const returnType: jompx.AppSyncIFields = {
            number3: GraphqlType.int({ isRequired: true }),
            number1: GraphqlType.int({ isRequired: true }),
            number2: GraphqlType.int({ isRequired: true }),
            result: GraphqlType.int({ isRequired: true }),
            test: {
                result1: GraphqlType.int({ isRequired: true }),
                result2: GraphqlType.int({ isRequired: true }),
                test: {
                    result1: GraphqlType.int({ isRequired: true }),
                    result2: GraphqlType.int({ isRequired: true })
                }
            }
        }

        // this.props.schemaBuilder?.addMutation({ name: 'mPostBusiness', dataSourceName: 'post', args, returnType, methodName: 'business' });
    }
}
