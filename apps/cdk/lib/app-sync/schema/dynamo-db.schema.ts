import * as jompx from '@jompx/constructs';
import { auth, datasource, lookup, operation, primaryKey, readonly, source, sortKey } from '@jompx/constructs'; // Custom directives.
import { Field, GraphqlType, InterfaceType, ObjectType, ResolvableField } from '@aws-cdk/aws-appsync-alpha';
import { AppSyncDatasource } from '@cdk/lib/cdk/stacks/app-sync.stack';
import { tag } from '../directives';

/**
 * Use GraphqlType for simple fields.
 * Use Field if additional attributes are required e.g. directives.
 * Use ResolvableField if the field exists in another type or datasource.
 * For one table design:
 *  - Name first fields PK and SK.
 *  - PK = ORG#<OrgName>
  */
export class DynamoDbSchema {

    public types: jompx.ISchemaTypes = { enumTypes: {}, inputTypes: {}, interfaceTypes: {}, objectTypes: {}, unionTypes: {} };

    constructor(
        private datasources: jompx.IDataSource
    ) {

        // Interface types.

        const DNode = new InterfaceType('DNode', {
            definition: {
                id: new Field({
                    returnType: GraphqlType.id({ isRequired: true }),
                    directives: [
                        primaryKey(true)
                    ]
                }),
                createdAt: new Field({
                    returnType: GraphqlType.awsDateTime({ isRequired: true })
                }),
                createdBy: new Field({
                    returnType: GraphqlType.awsDateTime({ isRequired: true })
                }),
                updatedAt: new Field({
                    returnType: GraphqlType.awsDateTime({ isRequired: true })
                }),
                updatedBy: new Field({
                    returnType: GraphqlType.awsDateTime({ isRequired: true })
                })
            }
        });
        this.types.interfaceTypes['DNode'] = DNode;

        const DMovie = new ObjectType('DMovie', {
            interfaceTypes: [DNode],
            definition: {
                // name: GraphqlType.string({ isRequired: true }),
                name: new Field({
                    returnType: GraphqlType.string({ isRequired: true }),
                    directives: [
                        auth([
                            { allow: 'private', provider: 'iam' },
                            // { allow: 'private', provider: 'userPool', groups: ['admin'] }
                        ]),
                        sortKey(true),
                        tag('test')
                    ]
                }),
                boolean: GraphqlType.boolean(),
                float: GraphqlType.float(),
                decimal: GraphqlType.float(),
                int: GraphqlType.int(),
                date: GraphqlType.awsDate(),
                dateTime: GraphqlType.awsDateTime(),
                email: GraphqlType.awsEmail(),
                ipAddress: GraphqlType.awsIpAddress(),
                json: GraphqlType.awsJson(),
                phone: GraphqlType.awsPhone(),
                time: GraphqlType.awsTime(),
                timestamp: GraphqlType.awsTimestamp(),
                url: GraphqlType.awsUrl(),
                sourceField: new Field({
                    returnType: GraphqlType.string(),
                    directives: [
                        source('sourceField')
                    ]
                }),
                dMovieActors: new ResolvableField({
                    // A movie must have actors.
                    returnType: jompx.JompxGraphqlType.objectType({ typeName: 'DMovieActor', isList: true, isRequiredList: true }), // String return type.
                    dataSource: this.datasources[AppSyncDatasource.dynamoDb],
                    directives: [
                        lookup({ from: 'DMovieActor', localField: 'id', foreignField: 'movieId' })
                    ]
                })
            },
            directives: [
                auth([
                    { allow: 'private', provider: 'iam' },
                    { allow: 'private', provider: 'userPool', groups: ['admin'] }
                ]),
                datasource(AppSyncDatasource.dynamoDb),
                source('movie'),
                operation(['findCursor', 'findOne', 'scanCursor', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'upsertOne', 'upsertMany', 'deleteOne', 'deleteMany']),
                tag('test')
            ]
        });
        this.types.objectTypes['DMovie'] = DMovie;

        const DMovieActor = new ObjectType('DMovieActor', {
            interfaceTypes: [DNode],
            definition: {
                movieId: GraphqlType.id({ isRequired: true }),
                actorId: GraphqlType.id({ isRequired: true }),
                dMovie: new ResolvableField({
                    returnType: DMovie.attribute({ isRequired: true }),
                    dataSource: this.datasources[AppSyncDatasource.dynamoDb],
                    directives: [
                        lookup({ from: 'DMovie', localField: 'movieId', foreignField: 'id' })
                    ]
                }),
                dActor: new ResolvableField({
                    returnType: DMovie.attribute({ isRequired: true }),
                    dataSource: this.datasources[AppSyncDatasource.dynamoDb],
                    directives: [
                        lookup({ from: 'DActor', localField: 'actorId', foreignField: 'id' })
                    ]
                })
            },
            directives: [
                auth([
                    // { allow: 'private', provider: 'iam' },
                    { allow: 'private', provider: 'userPool', groups: ['admin'] }
                ]),
                datasource(AppSyncDatasource.dynamoDb),
                source('movieActor'),
                operation(['find', 'findOne', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'upsertOne', 'upsertMany', 'deleteOne', 'deleteMany'])
            ]
        });
        this.types.objectTypes['DMovieActor'] = DMovieActor;

        const DActor = new ObjectType('DActor', {
            interfaceTypes: [DNode],
            definition: {
                name: GraphqlType.string({ isRequired: true }),
                // An actor can have 0 or more movies.
                dMovieActors: new ResolvableField({
                    returnType: DMovieActor.attribute({ isList: true }),
                    dataSource: this.datasources[AppSyncDatasource.dynamoDb],
                    directives: [
                        lookup({ from: 'DMovieActor', localField: 'id', foreignField: 'actorId' })
                    ]
                })
            },
            directives: [
                auth([
                    // { allow: 'private', provider: 'iam' },
                    { allow: 'private', provider: 'userPool', groups: ['admin'] }
                ]),
                datasource(AppSyncDatasource.dynamoDb),
                source('actor'),
                operation(['find', 'findOne', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'upsertOne', 'upsertMany', 'deleteOne', 'deleteMany'])
            ]
        });
        this.types.objectTypes['DActor'] = DActor;
    }
}
