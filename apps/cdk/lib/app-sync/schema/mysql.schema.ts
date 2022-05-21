import * as jompx from '@jompx/constructs';
import { Directive, Field, GraphqlType, InterfaceType, ObjectType, ResolvableField } from '@aws-cdk/aws-appsync-alpha';
import { AppSyncMySqlCustomDirective as CustomDirective } from '@jompx/constructs';
import { AppSyncDatasource } from '@cdk/lib/stacks/app-sync.stack';

export class MySqlSchema {

    public types: jompx.ISchemaTypes = { enumTypes: {}, inputTypes: {}, interfaceTypes: {}, objectTypes: {}, unionTypes: {} };

    constructor(
        private datasources: jompx.IDataSource
    ) {

        // Interface types.

        const MNode = new InterfaceType('MNode', {
            definition: {
                id: new Field({
                    returnType: GraphqlType.id({ isRequired: true }),
                    directives: [
                        CustomDirective.readonly(true)
                    ]
                }),
                isDeleted: new Field({
                    returnType: GraphqlType.boolean({ isRequired: true }),
                    directives: [
                        CustomDirective.readonly(true)
                    ]
                }),
                dateCreated: new Field({
                    returnType: GraphqlType.awsDateTime({ isRequired: true }),
                    directives: [
                        CustomDirective.readonly(true)
                    ]
                }),
                dateUpdated: new Field({
                    returnType: GraphqlType.awsDateTime({ isRequired: true }),
                    directives: [
                        CustomDirective.readonly(true)
                    ]
                })
            }
        });
        this.types.interfaceTypes.MNode = MNode;

        // Object types.

        const MPost = new ObjectType('MPost', {
            interfaceTypes: [MNode],
            definition: {
                date: GraphqlType.awsDateTime(),
                title: new Field({
                    returnType: GraphqlType.string(),
                    directives: [
                        CustomDirective.source('title')
                    ]
                }),
                mcomments: new ResolvableField({
                    returnType: jompx.JompxGraphqlType.objectType({ typeName: 'MComment', isList: true }),
                    dataSource: this.datasources[AppSyncDatasource.mySql],
                    directives: [
                        CustomDirective.lookup({ from: 'MComment', localField: 'id', foreignField: 'mpostId' })
                    ]
                })
            },
            directives: [
                Directive.cognito('admin'),
                Directive.iam(),
                CustomDirective.datasource(AppSyncDatasource.mySql),
                CustomDirective.source('post'),
                CustomDirective.operations(['find', 'findOne', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'deleteOne', 'deleteMany', 'destroyOne', 'destoryMany'])
                // CustomDirective.permissions(['read', 'create', 'update', 'delete'])
            ]
        });
        this.types.objectTypes.MPost = MPost;

        const MComment = new ObjectType('MComment', {
            interfaceTypes: [MNode],
            definition: {
                id: GraphqlType.id({ isRequired: true }),
                html: new Field({
                    returnType: GraphqlType.string(),
                    directives: [
                        CustomDirective.source('content')
                    ]
                }),
                mpostId: GraphqlType.id(),
                mpost: new ResolvableField({
                    returnType: MPost.attribute(),
                    dataSource: this.datasources[AppSyncDatasource.mySql],
                    directives: [
                        CustomDirective.lookup({ from: 'MPost', localField: 'mpostId', foreignField: 'id' })
                    ]
                })
            },
            directives: [
                Directive.cognito('admin'),
                Directive.iam(),
                CustomDirective.datasource(AppSyncDatasource.mySql),
                CustomDirective.source('comment'),
                CustomDirective.operations(['find', 'findOne', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'deleteOne', 'deleteMany', 'destroyOne', 'destoryMany'])
                // CustomDirective.permissions(['read', 'create', 'update', 'delete'])
            ]
        });
        this.types.objectTypes.MComment = MComment;

        // const SAccount = new ObjectType('SAccount', {
        //     definition: {
        //         accountId: GraphqlType.id({ isRequired: true }),
        //         accountName: GraphqlType.string()
        //     },
        //     directives: [
        //         Directive.custom('@datasource(name: "mysql")'),
        //         Directive.custom('@key(fields: "id")')
        //     ]
        // });
        // types.set('SAccount', SAccount);

        // const CUser = new ObjectType('CUser', {
        //     definition: {
        //         email: GraphqlType.string({ isRequired: true }),
        //         phone: GraphqlType.string(),
        //     },
        //     directives: [
        //         Directive.custom('@datasource(name: "mysql")'),
        //         Directive.custom('@key(fields: "id")')
        //     ]
        // });
        // types.set('CUser', CUser);

        // const MUser = new ObjectType('MUser', {
        //     interfaceTypes: [MNode],
        //     definition: {
        //         email: GraphqlType.id({ isRequired: true }),
        //         firstName: GraphqlType.string(),
        //         lastName: GraphqlType.string(),
        //         sAccount: new ResolvableField({
        //             returnType: SAccount.attribute({ isList: false }),
        //             dataSource: datasources.get('mysql')
        //         }),
        //         CUser: new ResolvableField({
        //             returnType: CUser.attribute({ isList: false }),
        //             dataSource: datasources.get('mysql')
        //         }),
        //         user: new Field({ returnType: CUser.attribute(), directives: [Directive.custom('@relation(local: "userId", foreign: "_id")')] }),
        //     },
        //     directives: [
        //         Directive.custom('@datasource(name: "mysql")'),
        //         Directive.custom('@key(fields: "id")'),
        //         Directive.custom('@method(names: "get,create,update,delete")')
        //     ]
        // });
        // types.set('MUser', MUser);

        // api.addQuery('getMUser', new ResolvableField({
        //     returnType: MUser.attribute(),
        //     dataSource: datasources.get('mysql'),
        //     pipelineConfig: [], // TODO: Add authorization Lambda function here.
        //     // Use the request mapping to inject stash variables (for use in Lambda function).
        //     // In theory, we could use a Lambda function instead of VTL but this should be much faster than invoking another Lambda.
        //     // Caution: payload should mimic Lambda resolver (no VTL). This syntax could change in the future.
        // }));

        // api.addMutation('myCustomMutation', new ResolvableField({
        //     returnType: GraphqlType.awsJson(),
        //     args: { myVar1: GraphqlType.id({ isRequired: true }), myVar2: GraphqlType.id({ isRequired: true }) },
        //     dataSource: datasources.get('mysql'),
        //     pipelineConfig: [], // Add authentication Lambda function here.
        // }));

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
