import { cpSync } from 'node:fs';
import { execSync } from 'node:child_process';
import * as path from 'path';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as cdk from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as jompx from '@jompx/constructs';
import * as jsql from '@jompx/sql-datasource';
import * as jdynamodb from '@jompx/dynamodb-datasource';
import { Config } from '@jompx-org/config';
import { DynamoDbStack } from './dynamo-db.stack';
import { AppSyncBuild } from '@cdk/lib/app-sync/build.construct';
import { AppSyncBusiness } from '@cdk/lib/app-sync/business.construct';
import { AppSyncSubscription } from '@cdk/lib/app-sync/subscription.construct';

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

        const config = new Config(this.node);

        const environment = config.environmentByEnv(props?.env);
        if (!environment) return;

        // Derive the app domain name from environment name e.g. admin.jompx.com, admin.test.jompx.com, admin.sandbox1.admin.com
        const domainName = environment.name === 'prod' ? `${props.domainName.label}.${props.domainName.rootDomainName}` : `${props.domainName.label}.${environment.name}.${props.domainName.rootDomainName}`;

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
            ],
            graphqlSchema: {
                filePathJson: path.join(process.cwd(), '..', '..', 'schema.graphql.json'), // OS safe path to file.
                directivesFilePathJson: path.join(process.cwd(), '..', '..', 'schema.graphql.directives.json'), // OS safe path to file.
                // filePathJson: path.join(__dirname, '..', '..', '..', '..', '..', 'schema.graphql.json'), // OS safe path to file. // Array(5).fill(..)
                // directivesFilePathJson: path.join(__dirname, '..', '..', '..', '..', '..', 'schema.graphql.directives.json'), // OS safe path to file. // Array(5).fill(..)
            }
        });

        this.graphqlApi = appSync.graphqlApi;
        this.schemaBuilder = appSync.schemaBuilder;

        // const preTrigger = new AppSyncDatasourcePreTrigger(this, 'AppSyncDatasourcePreTrigger', props.stackProps);

        // Create datasource layer.
        const layer = new lambda.LayerVersion(this, 'LambdaLayerAppSyncDatasource', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            description: 'AppSync datasource layer for Jompx.',
            // Bundle the layer lib (on CDK synth and deploy).
            // Example: https://dev.to/aws-builders/aws-cdk-fullstack-polyglot-with-asset-bundling-318h
            code: lambda.Code.fromAsset(path.join(process.cwd()), {
                bundling: {
                    user: 'root', // https://github.com/aws/aws-cdk/issues/8707
                    image: lambda.Runtime.NODEJS_18_X.bundlingImage,
                    // Docker build command.
                    command: ['sh', '-c', 'echo "Docker build not supported."'],
                    // TODO: Consider supporting a Docker build. Note that this is very slow.
                    // command: [
                    //     'sh', '-c', [
                    //         'npm install -g nx',
                    //         'nx build appsync-datasource-layer'
                    //     ].join(' && ')
                    // ],
                    // Local build command.
                    local: {
                        tryBundle(outputDir: string) {
                            try {
                                // It's important to get paths correct.
                                // It doesn't seem to matter what path is given to fromAsset. The working directory is the cdk root.
                                // outputDir is a full path to the cdk.out folder e.g. C:\Jompx.com\org\apps\cdk\cdk.out\asset.67a84092b65f2b2a8fab05e37765443cb312da0b800bd3b773155d919bff5275
                                // console.log('outputDir', outputDir);
                                const projectRootDir = path.join(process.cwd(), '..', '..');

                                // Build the nx lib. Must be in project root directory.
                                // On windows, execSync commands run in a command prompt (not powershell).
                                const execSyncResult1 = execSync(`cd ${projectRootDir} && nx build appsync-datasource-layer`).toString();
                                console.log('build appsync-datasource-layer: ', execSyncResult1);

                                // Lambda requires NodeJS layers to be in a specific directory structure.
                                // Put module files in a nodejs/node_modules folder. Files under node_modules should be in the same format as any other installed npm module.
                                // If there was a cross platform copy command we could do this as part of the shell command above.
                                // Copy dist files to the output directory.
                                cpSync('../../dist/libs/appsync-datasource-layer/', `${outputDir}/nodejs/node_modules/@jompx-org/appsync-datasource-layer/`, { recursive: true });

                                // Lambda layers must be self contained. Run npm install to include npm modules in the output directory.
                                const execSyncResult2 = execSync(`cd ${outputDir}/nodejs/node_modules/@jompx-org/appsync-datasource-layer/ && npm install`).toString();
                                console.log('npm install appsync-datasource-layer: ', execSyncResult2);
                            } catch {
                                return false;
                            }
                            return true;
                        }
                    }
                }
            }),
            compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
            compatibleArchitectures: [lambda.Architecture.X86_64]
        });

        // Add MySQL datasource.
        const jompxMySqlDataSource = new jsql.JompxAppSyncSqlDataSource(this, 'MySql', {
            datasourceId: 'mysql',
            // graphqlSchema: {
            //     filePathJson: path.join(process.cwd(), '..', '..', 'schema.graphql.json'), // OS safe path to file.
            //     directivesFilePathJson: path.join(process.cwd(), '..', '..', 'schema.graphql.directives.json'), // OS safe path to file.
            //     // filePathJson: path.join(__dirname, '..', '..', '..', '..', '..', 'schema.graphql.json'), // OS safe path to file. // Array(5).fill(..)
            //     // directivesFilePathJson: path.join(__dirname, '..', '..', '..', '..', '..', 'schema.graphql.directives.json'), // OS safe path to file. // Array(5).fill(..)
            // },
            lambdaFunctionProps: { memorySize: 128 * 4 },
            layers: [appSync.graphqlLambdaLayer, layer],
            subscriber: {
                moduleName: '@jompx-org/appsync-datasource-layer',
                className: 'Subscriber'
            },
            // triggers: {
            //     // preLambda: preTrigger.lambdaFunction
            // },
            options: {
                engine: 'mysql_8.0.x'
            }
        });
        this.schemaBuilder.addDataSource(jompxMySqlDataSource.lambdaFunction);

        // Add DynamoDb datasource.
        const jompxDynamoDbDataSource = new jdynamodb.JompxAppSyncDynamoDbDataSource(this, 'DynamoDb', {
            datasourceId: 'dynamodb',
            // graphqlSchema: {
            //     filePathJson: path.join(process.cwd(), '..', '..', 'schema.graphql.json'), // OS safe path to file.
            //     directivesFilePathJson: path.join(process.cwd(), '..', '..', 'schema.graphql.directives.json'), // OS safe path to file.
            //     // filePathJson: path.join(__dirname, '..', '..', '..', '..', '..', 'schema.graphql.json'), // OS safe path to file. // Array(5).fill(..)
            //     // directivesFilePathJson: path.join(__dirname, '..', '..', '..', '..', '..', 'schema.graphql.directives.json'), // OS safe path to file. // Array(5).fill(..)
            // },
            lambdaFunctionProps: { memorySize: 128 * 4 },
            layers: [appSync.graphqlLambdaLayer, layer],
            subscriber: {
                moduleName: '@jompx-org/appsync-datasource-layer',
                className: 'Subscriber'
            },
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
