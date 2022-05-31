import { AuthorizationType } from '@aws-cdk/aws-appsync-alpha';
import { PostBusiness } from './post.types'
import { AxiosGraphqlService as GraphqlService } from '@jompx/graphql';
import gql from 'graphql-tag';
import * as gtype from '@root/schema.graphql.types';
import get = require('get-value');
import { IAppSyncMethodProps } from '@jompx/constructs';

export class Post {

    // public mpostBusiness(args: { number3: number, number1: number, number2: number }): PostBusiness {

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

    public async businessGraphql(number1: string, props: IAppSyncMethodProps): Promise<object> {

        const fields = gql`fragment fields on MPostConnection {
            edges {
                node {
                    id
                }
            }
        }`;

        const data = await GraphqlService.find<gtype.QueryMPostFindArgs, gtype.MPostConnection>('MPost', fields, {
        }, { authorizationType: AuthorizationType.USER_POOL, authorization: props.cognito?.authorization });

        // const data = await GraphqlService.find<gtype.QueryMPostFindArgs, gtype.MPostConnection>('MPost', fields, {
        //     filter: {},
        //     sort: []
        // });

        return get(data, 'edges.0.node');
    }

    public async business(number1: number): Promise<PostBusiness> {

        // const fields = gql`fragment fields on MCommentConnection {
        //     item {
        //         id
        //     }
        // }`;

        // const variables: UpdateMLookupMutationVariables = {
        //     input: {
        //     }
        // };

        // GraphqlService.run

        return {
            number3: 3,
            number1: 2,
            number2: 1,
            result: 6
        }

    }

    // public business2(string2: string, string1: string) {
    //     return 'abc';
    // }
}