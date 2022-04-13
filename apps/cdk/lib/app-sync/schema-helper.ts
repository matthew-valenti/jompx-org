// import * as appsync from '@aws-cdk/aws-appsync-alpha';
// import pluralize = require('pluralize');

// // import get = require('get-value');
// import set = require('set-value');

// export default class SchemaHelper {
//     public api: appsync.GraphqlApi;

//     public dataSources: Map<string, appsync.LambdaDataSource>;

//     public types: Map<string, appsync.InterfaceType | appsync.ObjectType | appsync.InputType>;

//     constructor(
//         api: appsync.GraphqlApi,
//         dataSources: Map<string, appsync.LambdaDataSource>,
//         types: Map<string, appsync.InterfaceType | appsync.ObjectType | appsync.InputType>
//     ) {
//         this.api = api;
//         this.dataSources = dataSources;
//         this.types = types;
//     }

//     // public addQuery() {
//     //     // this.api.addQuery(
//     // }

//     // public addMutation() {
//     //     // this.api.addMutation(
//     // }

//     public addType(type: appsync.InterfaceType | appsync.ObjectType | appsync.InputType) {
//         this.api.addType(type);

//         if (type instanceof appsync.ObjectType) {
//             const methods = SchemaHelper.getDirectiveArgumentFromStatement(type.directives, 'method', 'names');
//             if (methods && methods.includes('get')) {
//                 this.addGet(type);
//             }
//         }
//     }

//     public addGet(objectType: appsync.ObjectType) {
//         const objectTypeName = objectType.name;
//         const objectTypeNamePlural = pluralize(objectTypeName);
//         const keyName = SchemaHelper.getDirectiveArgumentFromStatement(objectType?.directives, 'key', 'fields');
//         const dataSourceName = SchemaHelper.getDirectiveArgumentFromStatement(objectType?.directives, 'datasource', 'name');
//         const dataSource = this.dataSources.get(dataSourceName);

//         // Edge.
//         const edgeObjectType = new appsync.ObjectType(`${objectTypeName}Edge`, {
//             definition: {
//                 node: objectType.attribute()
//             }
//         });
//         this.api.addType(edgeObjectType);

//         // Connection.
//         const connectionObjectType = new appsync.ObjectType(`${objectTypeName}Connection`, {
//             definition: {
//                 edges: edgeObjectType.attribute({ isList: true }),
//                 pageInfo: this.types.get('PageInfo')!.attribute(),
//                 totalCount: appsync.GraphqlType.int()
//             }
//         });
//         this.api.addType(connectionObjectType);

//         // Set list query args.
//         const args = {};
//         set(args, 'filter', appsync.GraphqlType.awsJson());
//         set(args, 'search', appsync.GraphqlType.string());
//         set(args, 'sort', this.types.get('SortInput')!.attribute({ isList: true }));
//         set(args, 'skip', appsync.GraphqlType.int());
//         set(args, 'limit', appsync.GraphqlType.int());

//         // Add get list query.
//         this.api.addQuery(`get${objectTypeNamePlural}`, new appsync.ResolvableField({
//             returnType: connectionObjectType.attribute(),
//             args,
//             dataSource,
//             pipelineConfig: [], // TODO: Add authorization Lambda function here.
//             // Use the request mapping to inject stash variables (for use in Lambda function).
//             // In theory, we could use a Lambda function instead of VTL but this should be much faster than invoking another Lambda.
//             // Caution: payload should mimic Lambda resolver (no VTL). This syntax could change in the future.
//             requestMappingTemplate: appsync.MappingTemplate.fromString(`
//                 $util.qr($ctx.stash.put("method", "get"))
//                 $util.qr($ctx.stash.put("typeName", "${objectTypeName}"))
//                 $util.qr($ctx.stash.put("returnTypeName", "${connectionObjectType.name}"))
//                 ${SchemaHelper.pipelineRequestMappingTemplate}
//             `)
//         }));

//         // Add get one query.
//         this.api.addQuery(`get${objectTypeName}`, new appsync.ResolvableField({
//             returnType: objectType.attribute(),
//             args: { [keyName]: appsync.GraphqlType.id({ isRequired: true }) },
//             dataSource,
//             pipelineConfig: [],
//             requestMappingTemplate: appsync.MappingTemplate.fromString(`
//                 $util.qr($ctx.stash.put("method", "get"))
//                 $util.qr($ctx.stash.put("typeName", "${objectTypeName}"))
//                 $util.qr($ctx.stash.put("returnTypeName", "${objectType.name}"))
//                 ${SchemaHelper.pipelineRequestMappingTemplate}
//             `)
//         }));
//     }

//     // AppSync VTL snippet to pass all available params to Lambda function datasource.
//     private static readonly pipelineRequestMappingTemplate = `{
//             "version" : "2017-02-28",
//             "operation": "Invoke",
//             "payload": {
//                 "context": $util.toJson($ctx),
//                 "selectionSetList": $utils.toJson($ctx.info.selectionSetList),
//                 "selectionSetGraphQL": $utils.toJson($ctx.info.selectionSetGraphQL)
//             }
//         }`;

//     private static getDirectiveArgumentFromStatement(directives: any[] | undefined, identifier: string, argument: string): string {
//         let rv = '';

//         if (typeof (directives) !== 'undefined' && Array.isArray(directives)) {
//             const directive = directives.find((o: any) => o.statement.startsWith(`@${identifier}`));
//             if (directive) {
//                 const regExp = new RegExp(`^@${identifier}\\(${argument}: "(.*)"\\)$`, 'g');
//                 const match = regExp.exec(directive.statement);
//                 if (match?.length === 2) {
//                     rv = match[1];
//                 }
//             }
//         }

//         return rv;
//     }

//     // public static async getIntrospectionSchema(types: any, appsyncApiId: string) {
//     //     const awsAppsync = new AWS.AppSync();
//     //     const params = {
//     //         apiId: appsyncApiId,
//     //         format: 'JSON',
//     //         includeDirectives: true,
//     //     };
//     //     const data = await awsAppsync.getIntrospectionSchema(params).promise();
//     //     return JSON.parse(data.schema!.toString()).data.__schema.types; // eslint-disable-line no-underscore-dangle
//     // }
// }
