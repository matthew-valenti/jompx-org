import * as path from 'path';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as cdk from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from "constructs";
import * as jompx from '@jompx/constructs';
import * as jsql from '@jompx/sql-datasource';
import * as jdynamodb from '@jompx/dynamodb-datasource';
import { DynamoDbStack } from './dynamo-db.stack';
import { AppSyncBuild } from '@cdk/lib/app-sync/build.construct';
import { AppSyncBusiness } from '@cdk/lib/app-sync/business.construct';
import { AppSyncSubscription } from '@cdk/lib/app-sync/subscription.construct';
import { AppSyncDatasourcePreTrigger } from '@cdk/lib/app-sync/triggers/pre-trigger.construct';
const spawnSync = require('child_process').spawnSync;

export interface AppSyncStackProps extends cdk.StackProps {
    stackProps: cdk.StackProps | undefined;
    userPool: cdk.aws_cognito.UserPool;
    dataSourceStack: {
        dynamoDbStack: DynamoDbStack
    },
    domainName: {
        label: string;
        rootDomainName: string;
        certificate?: acm.Certificate
    }
}

export class AppSyncStack extends cdk.Stack {

    public graphqlApi: appsync.GraphqlApi;
    public schemaBuilder: jompx.AppSyncSchemaBuilder;

    constructor(scope: Construct, id: string, props: AppSyncStackProps) {
        super(scope, id, props);

        const config = new jompx.Config(this.node);
        const stage = config.stage;

        // Derive the app domain name from stage e.g. admin.jompx.com, admin.test.jompx.com, admin.sandbox1.admin.com
        const domainName = stage === 'prod' ? `${props.domainName.label}.${props.domainName.rootDomainName}` : `${props.domainName.label}.${stage}.${props.domainName.rootDomainName}`;

        // Create AppSync resource.
        const appSync = new jompx.AppSync(this, 'AppSync', {
            name: 'api',
            ...props.domainName?.certificate && {
                domainName: {
                    domainName,
                    certificate: props.domainName.certificate
                }
            },
            additionalAuthorizationModes: [
                {
                    authorizationType: appsync.AuthorizationType.USER_POOL,
                    userPoolConfig: { userPool: props.userPool }
                },
                {
                    authorizationType: appsync.AuthorizationType.API_KEY,
                    apiKeyConfig: {
                        expires: cdk.Expiration.after(cdk.Duration.days(365)),
                    }
                }
            ]
        });

        this.graphqlApi = appSync.graphqlApi;
        this.schemaBuilder = appSync.schemaBuilder;

        const preTrigger = new AppSyncDatasourcePreTrigger(this, 'AppSyncDatasourcePreTrigger', props.stackProps);

        // Create datasource layer.
        const layer = new lambda.LayerVersion(this, 'LambdaLayerAppSyncDatasource', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            description: 'AppSync datasource layer for Jompx.',
            // code: lambda.Code.fromAsset(path.join(process.cwd(), 'lib', 'app-sync', 'layers', 'subscriber')),
            //  P:\wwwroot\Jompx.com\org\apps\cdk\tsc.out\apps\cdk\lib\app-sync\layers\subscriber
            // code: lambda.Code.fromAsset(path.join(process.cwd(), 'tsc.out', 'apps', 'cdk', 'lib', 'app-sync', 'layers', 'subscriber'), {
            code: lambda.Code.fromAsset(path.join(process.cwd(), '..', '..', 'dist', 'libs', 'appsync-datasource-layer'), {
                // bundling: {
                //     image: lambda.Runtime.NODEJS_18_X.bundlingImage,
                //     local: {
                //         tryBundle(outputDir: string) {
                //           try {
                //             spawnSync('npm i')
                //           } catch {
                //             return false
                //           }
                //           return true
                //         },
                //     },
                //     // command: ['npm', 'install']
                // }
            }),
            compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
            compatibleArchitectures: [lambda.Architecture.X86_64]
        });

        // Add MySQL datasource.
        const jompxMySqlDataSource = new jsql.JompxAppSyncSqlDataSource(this, 'MySql', {
            datasourceId: 'mysql',
            graphqlSchema: {
                filePathJson: path.join(process.cwd(), '..', '..', 'schema.graphql.json'), // OS safe path to file.
                directivesFilePathJson: path.join(process.cwd(), '..', '..', 'schema.graphql.directives.json'), // OS safe path to file.
                // filePathJson: path.join(__dirname, '..', '..', '..', '..', '..', 'schema.graphql.json'), // OS safe path to file. // Array(5).fill(..)
                // directivesFilePathJson: path.join(__dirname, '..', '..', '..', '..', '..', 'schema.graphql.directives.json'), // OS safe path to file. // Array(5).fill(..)
            },
            lambdaFunctionProps: { memorySize: 128 * 2 },
            layers: [layer],
            triggers: {
                preLambda: preTrigger.lambdaFunction
            },
            options: {
                engine: 'mysql_8.0.x'
            }
        });
        this.schemaBuilder.addDataSource(jompxMySqlDataSource.lambdaFunction);

        // Add DynamoDb datasource.
        const jompxDynamoDbDataSource = new jdynamodb.JompxAppSyncDynamoDbDataSource(this, 'DynamoDb', {
            datasourceId: 'dynamodb',
            graphqlSchema: {
                filePathJson: path.join(process.cwd(), '..', '..', 'schema.graphql.json'), // OS safe path to file.
                directivesFilePathJson: path.join(process.cwd(), '..', '..', 'schema.graphql.directives.json'), // OS safe path to file.
                // filePathJson: path.join(__dirname, '..', '..', '..', '..', '..', 'schema.graphql.json'), // OS safe path to file. // Array(5).fill(..)
                // directivesFilePathJson: path.join(__dirname, '..', '..', '..', '..', '..', 'schema.graphql.directives.json'), // OS safe path to file. // Array(5).fill(..)
            },
            lambdaFunctionProps: { memorySize: 128 * 2 },
            options: {}
        });
        this.schemaBuilder.addDataSource(jompxDynamoDbDataSource.lambdaFunction);

        // Security: Grant the DynamoDb Lambda datasource read/write access to all DynamoDb tables.
        props.dataSourceStack.dynamoDbStack.tables.forEach(table => {
            table.grantReadWriteData(jompxDynamoDbDataSource.lambdaFunction);
        });

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

        // Add subscriptions.
        new AppSyncSubscription(this, 'AppSyncSubscription', {
            graphqlApi: this.graphqlApi,
            schemaBuilder: this.schemaBuilder
        });
    }
}
