import * as cdk from 'aws-cdk-lib';
import * as lambdanjs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { GraphqlType, InputType, ObjectType, Field } from '@aws-cdk/aws-appsync-alpha';
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
        this.findExample();
        this.queryExample();
    }

    private addDataSource() {

        // TODO: Implement Aspect and auto pass variables to all business Lambdas. https://docs.aws.amazon.com/cdk/v2/guide/aspects.html
        const lambdaFunction = new lambdanjs.NodejsFunction(this, 'handler', {
            ...jompx.DatasourceLambdaDefaultProps,
            memorySize: 128 * 2,
            description: `AppSync resolver for post.`,
            environment: {
                // TODO: This fails one first time deploy because /appSync/graphqlUrl does not exist in SSM yet. Try catch does not work. Unable to find solution?
                // graphqlUrl: ssm.StringParameter.valueForStringParameter(this, '/appSync/graphqlUrl')
            }
        });

        // TODO: Lock down permissions.
        lambdaFunction.addToRolePolicy(new cdk.aws_iam.PolicyStatement({
            actions: ['appsync:GraphQL'],
            resources: ['*']
            // TODO: resources: ['arn:${Partition}:appsync:${Region}:${Account}:apis/${GraphQLAPIId}/*']
        }));

        this.props.schemaBuilder.addDataSource('mPost', lambdaFunction);
    }

    /**
     * Set name.
     * Define input.
     * Define output.
     * Define auth.
     * Call add.
     */
    private findExample() {

        const mutationName = 'mPostFindExample';

        const input = {
            number1: GraphqlType.int({ isRequired: true })
        };

        const output = {
            id: new Field({
                returnType: GraphqlType.id(),
                directives: [
                    jompx.auth([{ provider: 'iam' }]) // TODO: Implement field level security.
                ]
            }),
        };

        const auth = jompx.auth([
            { provider: 'iam' }
        ]);

        this.props.schemaBuilder.addMutation({ name: mutationName, dataSourceName: 'mPost', input, output, auth, methodName: this.findExample.name });
    }

    private queryExample() {

        const mutationName = 'mPostQueryExample';

        const input = {
            number1: GraphqlType.int({ isRequired: true }),
            test: {
                number1: GraphqlType.int({ isRequired: true }),
            }
        };

        const output = {
            id: GraphqlType.id(),
            test: {
                result1: GraphqlType.int({ isRequired: true }),
                result2: GraphqlType.int({ isRequired: true }),
                test: {
                    result1: GraphqlType.int({ isRequired: true }),
                    result2: GraphqlType.int({ isRequired: true })
                }
            }
        };

        const auth = jompx.auth([
            { provider: 'iam' }
        ]);

        this.props.schemaBuilder.addMutation({ name: mutationName, dataSourceName: 'mPost', input, output, auth, methodName: this.queryExample.name });
    }
}
