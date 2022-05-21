import type { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import * as changeCase from 'change-case';

export class GraphqlQuery {

    public static find(typeName: string, fieldsFragment: DocumentNode): DocumentNode {

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
}