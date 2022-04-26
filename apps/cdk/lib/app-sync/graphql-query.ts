// eslint-disable-next-line import/no-extraneous-dependencies
import * as changeCase from 'change-case';
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as graphql from 'graphql';
// eslint-disable-next-line import/no-extraneous-dependencies
import gql from 'graphql-tag';
// eslint-disable-next-line @typescript-eslint/no-require-imports
// import get = require('get-value');

// https://www.npmjs.com/package/aws4-axios

export class GraphqlQuery {

    public static find(typeName: string, fieldsFragment: graphql.DocumentNode): graphql.DocumentNode {

        const queryName = `${changeCase.camelCase(typeName)}Find`;

        return gql`query ${queryName} (
                $filter: AWSJSON
                $limit: Int
                $skip: Int
                $sort: [SortInput]
            ) {
                ${queryName}(filter: $filter, limit: $limit, skip: $skip, sort: $sort) {
                    ...fields
                }
            }
            ${fieldsFragment}
        `;
    }

    public static async run(query: graphql.DocumentNode, variables: object) {

        const { data } = await axios({
            method: 'post',
            url: 'https://rd7b4x2rbjha7k2ti6z6yjedly.appsync-api.us-west-2.amazonaws.com/graphql',
            data: {
                query: graphql.print(query),
                variables
            }
        });
        console.log('data', data);
        return data;
    }
}

// `${query}`,