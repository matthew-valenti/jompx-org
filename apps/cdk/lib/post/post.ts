import { PostBusiness } from './post.types'
import { GraphqlQuery } from '@cdk/lib/app-sync/graphql-query';
import gql from 'graphql-tag';

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

    public business(number1: number): PostBusiness {

        // const fields = gql`fragment fields on MCommentConnection {
        //     item {
        //         id
        //     }
        // }`;

        // const variables: UpdateMLookupMutationVariables = {
        //     input: {
        //     }
        // };

        // GraphqlQuery.run

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