// For each principal (i.e. AppSync authorization type):
//   a. Define GraphQL object access: GraphQLObjectAccess (required).
//   b. Define GraphQL object property access: GraphQLFieldAccess (optional).
// Use "is" for GraphQLObjectAccess or GraphQLFieldAccess. Auth request principal will be an auth provider.
// Do NOT mix GraphQL coarse grain policies (GraphQLObjectAccess, GraphQLFieldAccess) with fine grain policies (Find, FindOne, InsertOne, InsertMany, UpdateOne, UpdateMany, UpsertOne, UpsertMany, DeleteOne, DeleteMany).
@description("[Coarse] [API=admin] [Principal=AuthType] [Object=All] [Reason=Can access all objects.]")
permit (
    principal is IAM,
    action == Action::"GraphQLObjectAccess",
    resource // is MysqlMovie OR resource == SchemaEntity::"MysqlMovie"
);

@description("[Coarse] [API=admin] [Principal=AuthType] [Object=All] [Reason=Can access all fields on all objects.]")
permit (
    principal is IAM,
    action == Action::"GraphQLFieldAccess",
    resource // is MysqlMovie OR resource == SchemaEntity::"MysqlMovie"
);

// when
// {
//     context has api &&
//     context.api == "admin" // Need static identifier to avoid no apiId on first create AppSync resource  e.g. arn:aws:appsync:__region__:__accountId__:apis/__privateApiId__
// };
// @description("Alternate syntax.")
// permit (
//     principal == IAM::"All", // All is NOT considered good practice i.e. it's not a UID. What about? IAM::"__accountId__"
//     action == Action::"GraphQLObjectAccess",
//     resource == SchemaEntity::"MysqlMovie"
// )
// when { context has api && context.api == "admin"};
@description("[Coarse] [API=admin] [Principal=AuthType] [Object=All] [Reason=Can access all operations on all resources.]")
permit (
    principal is IAM,
    action in
        [Action::"Find",
         Action::"FindOne",
         Action::"InsertOne",
         Action::"InsertMany",
         Action::"UpdateOne",
         Action::"UpdateMany",
         Action::"UpsertOne",
         Action::"UpsertMany",
         Action::"DeleteOne",
         Action::"DeleteMany"],
    resource
);

// when { context has api && context.api == "admin" };
@description("[Coarse] [API=admin] [Principal=Group] [Group=Admin] [Object=All] [Reason=Can access all objects.]")
permit (
    principal in CognitoGroup::"Admin",
    action == Action::"GraphQLObjectAccess",
    resource
)
when { context has api && context.api == "admin" };

@description("[Coarse] [API=admin] [Principal=Group] [Group=Admin] [Object=All] [Reason=Can access all fields on all objects.]")
permit (
    principal in CognitoGroup::"Admin",
    action == Action::"GraphQLFieldAccess",
    resource
)
when { context has api && context.api == "admin" };

// @description("Alternate syntax!")
// permit (
//     principal is Cognito, // AppSync doesn't recognize directives on different Cognito user pools: CognitoGroup::"__region__.__userPoolId__.Guest"
//     action == Action::"GraphQLObjectAccess",
//     resource is MysqlMovie
// )
// when { context has api && context.api == "admin"};
@description("[Coarse] [API=admin] [Principal=Group] [Group=Admin] [Object=All] [Reason=Can access all operations on all resources.]")
permit (
    principal in CognitoGroup::"Admin",
    action in
        [Action::"Find",
         Action::"FindOne",
         Action::"InsertOne",
         Action::"InsertMany",
         Action::"UpdateOne",
         Action::"UpdateMany",
         Action::"UpsertOne",
         Action::"UpsertMany",
         Action::"DeleteOne",
         Action::"DeleteMany"],
    resource
)
when { context has api && context.api == "admin" };
