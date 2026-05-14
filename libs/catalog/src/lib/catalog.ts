import * as jompx from '@jompx/constructs';
import { mysqlEntities } from './datasources/mysql/index';
import { mongodbEntities } from './datasources/mongodb/index';
import { dynamodbEntities } from './datasources/dynamodb/index';
import { commonAttributes } from './commonAttributes/index';
import { complexAttributes } from './complexAttributes/index';
import { enums } from './enums/index';

export const catalog: jompx.Catalog = {
    version: '0.0.0',
    datasources: {
        mysql: {
            type: 'MySQL',
            entities: {
                ...mysqlEntities,
            },
            api: {
                datasourceId: 'mysql',
                defaultPaginationType: 'offset',
            },
        },
        mongodb: {
            type: 'MongoDB Atlas',
            entities: {
                ...mongodbEntities,
            },
            api: {
                datasourceId: 'mongodb',
                defaultPaginationType: 'cursor',
            },
        },
        dynamodb: {
            type: 'DynamoDB',
            entities: {
                ...dynamodbEntities,
            },
            api: {
                datasourceId: 'dynamodb',
                defaultPaginationType: 'cursor',
            },
        },
    },
    commonAttributes,
    complexAttributes,
    enums,
    apis: {
        admin: {
            type: 'graphql',
            rootDomain: 'jompx.com',
            subdomain: 'admin',
            meta: {

                description: 'Admin GraphQL API for internal admin apps. Contains all endponts.',
                url: 'https://admin.jompx.com/graphql',
            },
        },
        api: {
            type: 'graphql',
            rootDomain: 'jompx.com',
            subdomain: 'api',
            meta: {
                description:
                    'App GraphQL API for user apps. Contains app(s) specific endpoints only.',
                url: 'https://api.jompx.com/graphql',
            },
        },
    },
};
