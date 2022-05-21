import { AuthorizationType } from '@aws-cdk/aws-appsync-alpha';
import axios from 'axios';
import { AxiosRequestHeaders } from 'axios';
import { aws4Interceptor } from "aws4-axios";
import * as graphql from 'graphql';
import get = require('get-value');
import * as process from 'process';
import { GraphqlQuery } from './graphql-query';

// https://www.npmjs.com/package/aws4-axios

export interface GraphqlServiceMethodProps {
    authorizationType: AuthorizationType,
    authorization?: string
}

interface RunArgs {
    query: graphql.DocumentNode;
    variables: object;
    authorizationType: AuthorizationType;
    authorization?: string
}

export class GraphqlService {

    public static async run({ query, variables, authorizationType, authorization }: RunArgs) {

        // TODO: Expose header params externally.
        const headers: AxiosRequestHeaders = {};

        if (!process.env.graphqlUrl) {
            throw ('An AppSync GraphQL URL is missing from Lambda process.env.');
        }

        if (authorizationType === AuthorizationType.USER_POOL && !authorization) {
            throw ('AuthorizationType is USER_POOL but authorization string is missing.');
        };

        switch (authorizationType) {
            case AuthorizationType.USER_POOL:
                if (authorization) {
                    headers.Authorization = authorization;
                }
                break;
            case AuthorizationType.IAM:
                // Create an Axios AWS4 interceptor.
                const interceptor = aws4Interceptor({
                    region: process.env.AWS_REGION,
                    service: 'appsync',
                });
                axios.interceptors.request.use(interceptor);
                break;
        }

        // Increase max request body size to handle large GraphQL queries.
        headers.maxBodyLength = 100000;

        const response = await axios({
            method: 'post',
            url: process.env.graphqlUrl, // 'https://bgsw3draavbmnh36dc4inulzdu.appsync-api.us-west-2.amazonaws.com/graphql',
            headers,
            data: {
                query: graphql.print(query),
                variables
            }
        });
        console.log('axios response', response);
        const queryName = get(Object.keys(response?.data?.data), '0');
        return get(response, `data.data.${queryName}`, undefined);
    }

    // Overloads.
    // public static async find<T>(typeName: string, fieldsFragment: graphql.DocumentNode, event?: any): Promise<T>;
    // public static async find<T1, T2>(typeName: string, fieldsFragment: graphql.DocumentNode, variables: T1, event?: any): Promise<T2>;
    // // Implementation.
    // public static async find<T1, T2>(typeName: string, fieldsFragment: graphql.DocumentNode, arg1?: unknown, arg2?: unknown): Promise<T2> {
    //     const query = GraphqlQuery.find(typeName, fieldsFragment);
    //     return arg2 === undefined ? GraphqlService.run(query, {}, AuthorizationType.USER_POOL, arg1) : GraphqlService.run(query, arg1, AuthorizationType.USER_POOL, arg2);
    // }

    // public static async find<T>(typeName: string, fieldsFragment: graphql.DocumentNode, authorizationType: AuthorizationType, authorization?: string): Promise<T>;
    // public static async find<T1, T2>(typeName: string, fieldsFragment: graphql.DocumentNode, variables: T1, authorizationType: AuthorizationType, authorization?: string): Promise<T2>;
    // // Implementation.
    // // public static async find<T1, T2>(typeName: string, fieldsFragment: graphql.DocumentNode, arg1?: unknown, arg2?: unknown, authorizationType?: AuthorizationType, authorization?: string): Promise<T2> {
    // public static async find<T1, T2>(typeName: string, fieldsFragment: graphql.DocumentNode, variables: T1, authorizationType: AuthorizationType, authorization?: string): Promise<T2> {

    //     console.log('typeName', typeName);
    //     console.log('fieldsFragment', fieldsFragment);
    //     console.log('variables', variables);
    //     console.log('authorizationType', );
    //     console.log('authorization', authorization);

    //     // return GraphqlService.run({
    //     //     query: GraphqlQuery.find(typeName, fieldsFragment),
    //     //     variables: variables ?? {},
    //     //     authorizationType: authorizationType ?? AuthorizationType.USER_POOL,
    //     //     authorization
    //     // });

    //     return {} as T2;
    // }

    public static async find<T1, T2>(typeName: string, fieldsFragment: graphql.DocumentNode, variables: T1, props: GraphqlServiceMethodProps): Promise<T2> {
        return GraphqlService.run({
            query: GraphqlQuery.find(typeName, fieldsFragment),
            variables: variables ?? {},
            authorizationType: props.authorizationType,
            authorization: props.authorization
        });
    }
}

// `${query}`,
// https://www.npmjs.com/package/gql-generator
// https://blog.logrocket.com/client-side-query-customization-in-graphql/

//  authorization: 'AWS4-HMAC-SHA256 Credential=ASIAQ62THEM7VGZHFGUJ/20220512/us-west-2/appsync/aws4_request, SignedHeaders=accept;content-encoding;content-length;content-type;host;x-amz-date;x-amz-security-token, Signature=52c643528de626a59faced7d454b3e631742d24fe37a3191bf4fa5445e8186e3',