@description("[Coarse] [API=api] [Principal=AuthType] [Object=MysqlMovie] [Reason=IAM cannot access GraphQL API. Dummy rule only for test.]")
forbid (
    principal is IAM,
    action == Action::"GraphQLObjectAccess",
    resource is MysqlMovie
)
when { context has api && context.api == "api" };

@description("[Coarse] [API=api] [Principal=Group] [Group=Admin] [Object=MysqlMovie] [Field=owners] [Reason=Only admin can see all owners. Forbids access for all other Cognito groups.]")
permit (
    principal == CognitoGroup::"Admin",
    action == Action::"GraphQLFieldAccess",
    resource == SchemaAttribute::"MysqlMovie/owners"
)
when { context has api && context.api == "api" };

@description("[Coarse] [API=api] [Principal=Group] [Groups=Editor,Guest] [Object=MysqlMovie] [Reason=Can access object.]")
permit (
    principal,
    action == Action::"GraphQLObjectAccess",
    resource is MysqlMovie
)
when
{
    (principal has groupName &&
     principal.groupName == "Editor" ||
     principal has groupName &&
     principal.groupName == "Guest") &&
    context has api &&
    context.api == "api"
};

@description("[Coarse] [API=api] [Principal=Group] [Groups=Editor, Guest] [Object=MysqlMovie] [Reason=Can run actions.]")
permit (
    principal,
    action in [Action::"Find", Action::"FindOne"],
    resource is MysqlMovie
)
when
{
    principal has groupName &&
    principal.groupName == "Editor" &&
    principal has groupName &&
    principal.groupName == "Guest" &&
    context has api &&
    context.api == "api"
};

@description("[Fine] [API=api] [Principal=User] [Group=Editor] [Object=MysqlMovie] [Reason=Can manage their own data only.]")
permit (
    principal,
    action in
        [Action::"InsertOne",
         Action::"InsertMany",
         Action::"UpdateOne",
         Action::"UpdateMany",
         Action::"UpsertOne",
         Action::"UpsertMany",
         Action::"DeleteOne",
         Action::"DeleteMany"],
    resource is MysqlMovie
)
when
{
    principal has groups &&
    principal.groups.contains("Editor") &&
    resource has owners &&
    resource.owners.contains(principal.sub) &&
    context has api &&
    context.api == "api"
};

@description("[Coarse] [API=api] [Principal=User] [Group=Editor] [Object=MysqlMovie] [Reason=Can run actions.]")
permit (
    principal,
    action in [Action::"Find", Action::"FindOne"],
    resource is MysqlMovie
)
when
{
    principal has groups &&
    principal.groups.contains("Editor") &&
    context has api &&
    context.api == "api"
};
// @description("Cognito user 'Jane' can delete movies.")
// permit (
//     principal == CognitoUser::"__region__.__userPoolId__.__cognitosub__",
//     action in [Action::"DeleteOne", Action::"DeleteMany"],
//     resource is MysqlMovie
// )
// when {
//     context has api && context.api == "api"
// };
