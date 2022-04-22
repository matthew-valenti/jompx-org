import * as appsync from '@aws-cdk/aws-appsync-alpha';
import { Directive, Field, GraphqlType, InputType, InterfaceType, ObjectType, ResolvableField } from '@aws-cdk/aws-appsync-alpha';
// import SchemaHelper from '@cdk/schema-helper';

export default class Schema {
    constructor(
        api: appsync.GraphqlApi,
        datasources: Map<string, appsync.LambdaDataSource>
    ) {
        const types = new Map<string, InterfaceType | ObjectType | InputType>();

        // Interface types.

        const MNode = new InterfaceType('MNode', {
            definition: {
                id: GraphqlType.id({ isRequired: true }),
                isDeleted: GraphqlType.boolean({ isRequired: true }),
                dateCreated: GraphqlType.awsDateTime({ isRequired: true }),
                dateUpdated: GraphqlType.awsDateTime({ isRequired: true })
            }
        });
        types.set('MNode', MNode);

        // Pagination type.

        const PageInfo = new ObjectType('PageInfo', {
            definition: {
                skip: GraphqlType.int(),
                limit: GraphqlType.int()
            }
        });
        types.set('PageInfo', PageInfo);

        // Sort input type.

        const SortInput = new InputType('SortInput', {
            definition: {
                fieldName: GraphqlType.string(),
                direction: GraphqlType.int()
            }
        });
        types.set('SortInput', SortInput);

        // Project object types.

        const SAccount = new ObjectType('SAccount', {
            definition: {
                accountId: GraphqlType.id({ isRequired: true }),
                accountName: GraphqlType.string()
            },
            directives: [
                Directive.custom('@datasource(name: "mysql")'),
                Directive.custom('@key(fields: "id")')
            ]
        });
        types.set('SAccount', SAccount);

        const CUser = new ObjectType('CUser', {
            definition: {
                email: GraphqlType.string({ isRequired: true }),
                phone: GraphqlType.string(),
            },
            directives: [
                Directive.custom('@datasource(name: "mysql")'),
                Directive.custom('@key(fields: "id")')
            ]
        });
        types.set('CUser', CUser);

        const MUser = new ObjectType('MUser', {
            interfaceTypes: [MNode],
            definition: {
                email: GraphqlType.id({ isRequired: true }),
                firstName: GraphqlType.string(),
                lastName: GraphqlType.string(),
                sAccount: new ResolvableField({
                    returnType: SAccount.attribute({ isList: false }),
                    dataSource: datasources.get('mysql')
                }),
                CUser: new ResolvableField({
                    returnType: CUser.attribute({ isList: false }),
                    dataSource: datasources.get('mysql')
                }),
                user: new Field({ returnType: CUser.attribute(), directives: [Directive.custom('@relation(local: "userId", foreign: "_id")')] }),
            },
            directives: [
                Directive.custom('@datasource(name: "mysql")'),
                Directive.custom('@key(fields: "id")'),
                Directive.custom('@method(names: "get,create,update,delete")')
            ]
        });
        types.set('MUser', MUser);

        api.addQuery('getMUser', new appsync.ResolvableField({
            returnType: MUser.attribute(),
            dataSource: datasources.get('mysql'),
            pipelineConfig: [], // TODO: Add authorization Lambda function here.
            // Use the request mapping to inject stash variables (for use in Lambda function).
            // In theory, we could use a Lambda function instead of VTL but this should be much faster than invoking another Lambda.
            // Caution: payload should mimic Lambda resolver (no VTL). This syntax could change in the future.
        }));

        api.addMutation('myCustomMutation', new appsync.ResolvableField({
            returnType: appsync.GraphqlType.awsJson(),
            args: { myVar1: appsync.GraphqlType.id({ isRequired: true }), myVar2: appsync.GraphqlType.id({ isRequired: true }) },
            dataSource: datasources.get('mysql'),
            pipelineConfig: [], // Add authentication Lambda function here.
        }));

        // Auto generate method schema.
        // const schemaHelper = new SchemaHelper(api, datasources, types);
        // types.forEach((type) => {
        //     schemaHelper.addType(type);
        // });
    }
}

// User.addField({ fieldName: 'userSecurityRoles', field: new Field({ returnType: UserSecurityRole.attribute({ isList: true }), directives: [Directive.custom('@relation(local: "_id", foreign: "userId")')] }) });
// SecurityRole.addField({ fieldName: 'userSecurityRoles', field: new Field({ returnType: UserSecurityRole.attribute({ isList: true }), directives: [Directive.custom('@relation(local: "_id", foreign: "securityRoleId")')] }) });

// https://stackoverflow.com/questions/41515679/can-you-make-a-graphql-type-both-an-input-and-output-type
// const UserType = `
//     name: String!,
//     surname: String!
// `;

// const schema = graphql.buildSchema(`
//     type User {
//         ${UserType}
//     }
//     input InputUser {
//         ${UserType}
//     }
// `) 