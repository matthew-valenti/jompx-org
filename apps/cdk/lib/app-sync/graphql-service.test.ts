import { GraphqlService } from './graphql-service';
import gql from 'graphql-tag';
import { AuthorizationType } from '@aws-cdk/aws-appsync-alpha';
import * as gtype from '@root/schema.graphql.types';

/**
 * Run test on CLI:
 *  ./scripts/pareto_cmd.sh sb2 npm run test message-data.test.ts
 *  .\scripts\pareto_cmd.ps1 sb2 npm run test message-data.test.ts
 */

test.only('find method overloads', async () => {

    const fields = gql`fragment fields on MPostConnection {
        edges {
            node {
                id
            }
        }
    }`;

    // await GraphqlService.find<gtype.MCommentConnection>('MPost', fields, AuthorizationType.USER_POOL, 'abc123');
    // await GraphqlService.find<gtype.QueryMPostFindArgs, gtype.MCommentConnection>('MPost', fields, {}, AuthorizationType.USER_POOL, 'abc123');
});
