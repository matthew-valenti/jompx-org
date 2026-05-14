@description("[Coarse] [API=api] [Principal=Group] [Groups=Editor,Guest] [Object=MysqlMovieActor] [Reason=Can access object.]")
permit (
    principal,
    action == Action::"GraphQLObjectAccess",
    resource is MysqlMovieActor
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

@description("[Coarse] [API=api] [Principal=User] [Group=Editor] [Object=MysqlMovieActor] [Reason=Can run actions.]")
permit (
    principal,
    action in [Action::"Find", Action::"FindOne"],
    resource is MysqlMovieActor
)
when
{
    principal has groups &&
    principal.groups.contains("Editor") &&
    context has api &&
    context.api == "api"
};

@description("[Fine] [API=api] [Principal=User] [Group=Editor] [Object=MysqlMovieActor] [Reason=Can manage their own data only.]")
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
    resource is MysqlMovieActor
)
when
{
    principal has groups &&
    principal.groups.contains("Editor") &&
    resource has mysqlMovie &&
    resource.mysqlMovie has owners &&
    resource.mysqlMovie.owners.contains(principal.sub) &&
    context has api &&
    context.api == "api"
};

@description("[Coarse] [API=api] [Principal=User] [Group=Guest] [Object=MysqlMovieActor] [Reason=Can run actions.]")
permit (
    principal,
    action in [Action::"Find", Action::"FindOne"],
    resource is MysqlMovieActor
)
when
{
    principal has groups &&
    principal.groups.contains("Guest") &&
    context has api &&
    context.api == "api"
};
