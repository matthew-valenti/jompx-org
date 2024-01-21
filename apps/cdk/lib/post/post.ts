import { AuthorizationType } from 'aws-cdk-lib/aws-appsync';
import { PostBusiness } from './post.types'
import { AxiosGraphqlService as GraphqlService } from '@jompx/graphql';
import gql from 'graphql-tag';
import * as gtype from '@root/schema.graphql.types';
import get = require('get-value');
import { AppSyncMethodProps } from '@jompx/constructs';

export class Post {

    // public simpleExample(args: { number3: number, number1: number, number2: number }): PostBusiness {

    //     const result = args.number1 + args.number2

    //     return {
    //         number3: args.number3,
    //         number1: args.number1,
    //         number2: args.number2,
    //         result
    //     }
    // }

    // public business(number3: number, number1: number, number2: number): PostBusiness {

    //     const result = number1 + number2 + number3;

    //     const rv = {
    //         number3: number3,
    //         number1: number1,
    //         number2: number2,
    //         result
    //     }

    //     console.log('rv', rv);
    //     return rv;
    // }

    public async findExample(input: gtype.MPostFindExampleInput, props: AppSyncMethodProps): Promise<gtype.MPostFindExampleOutput> { // TODO: Should our methods return a type?

        // 1. Define fragment. Must use codegen to create type e.g. FindExampleMMovieConnectionFragmentDoc
        // The fragment name must be unique because we're typing the output fields.
        gql`fragment FindExampleMMovieConnection on MMovieConnection {
            edges {
                node {
                    id
                }
            }
        }`;

        // 2. Call find.
        const data = await GraphqlService.find(gtype.FindExampleMMovieConnectionFragmentDoc, {
            limit: 1
        }, {
            // authorizationType: AuthorizationType.USER_POOL,
            // authorization: props.cognito?.authorization
            authorizationType: AuthorizationType.IAM
        });

        // 3. Return output.
        return {
            id: data?.edges?.at(0)?.node?.id // input.number1.toString()
        };
    }

    public async queryExample(input: gtype.MPostQueryExampleInput, props: AppSyncMethodProps): Promise<gtype.MPostQueryExampleOutput> {

        // Define query. Must use codegen to create type e.g. MMovieFindDocument
        gql`
            query mMovieFind($limit: Int) {
                mMovieFind(limit: $limit) {
                    edges {
                        node {
                            id
                        }
                    }
                }
            }
        `;

        // const data = await GraphqlService.find<gtype.QueryMMovieFindArgs, gtype.MMovieConnection>('MPost', fields, {
        // }, { authorizationType: AuthorizationType.USER_POOL, authorization: props.cognito?.authorization });

        // Call the query method (used for any queries). Both variables and return data are typesafe.
        // Use {} for no variables.
        const data = await GraphqlService.query(gtype.MMovieFindDocument, {
            limit: 1
        }, {
            // authorizationType: AuthorizationType.USER_POOL,
            // authorization: props.cognito?.authorization
            authorizationType: AuthorizationType.IAM
        });

        // const data = await GraphqlService.query<gtype.MMovieFindQuery, gtype.MMovieFindQueryVariables>(gtype.MMovieFindDocument, {
        //     limit: 1
        // }, {
        //     authorizationType: AuthorizationType.USER_POOL,
        //     authorization: props.cognito?.authorization
        // });

        // 
        // const data2 = await GraphqlService.query(gtype.MMovieFindDocument, {
        //     limit: 1
        // }, {
        //     authorizationType: AuthorizationType.USER_POOL,
        //     authorization: props.cognito?.authorization
        // });

        // const data = await GraphqlService.find<gtype.QueryMPostFindArgs, gtype.MPostConnection>('MPost', fields, {
        //     filter: {},
        //     sort: []
        // });

        console.log('businessCallGraphqlFind data', data);
        return {
            id: data?.mMovieFind?.edges?.at(0)?.node?.id, // input.number1.toString()
            test: {
                result1: 1,
                result2: 2,
                test: {
                    result1: 1,
                    result2: 2,
                }
            }
        }
    }
}