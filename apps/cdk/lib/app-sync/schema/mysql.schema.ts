import * as jompx from '@jompx/constructs';
import { auth, datasource, lookup, operation, readonly, source } from '@jompx/constructs'; // Custom directives.
import { Field, GraphqlType, InterfaceType, ObjectType, ResolvableField } from '@aws-cdk/aws-appsync-alpha';

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
                        readonly(true)
                    ]
                }),
                createdAt: new Field({
                    returnType: GraphqlType.awsDateTime({ isRequired: true }),
                    directives: [
                        readonly(true)
                    ]
                }),
                createdBy: new Field({
                    returnType: GraphqlType.awsDateTime({ isRequired: true }),
                    directives: [
                        readonly(true)
                    ]
                }),
                updatedAt: new Field({
                    returnType: GraphqlType.awsDateTime({ isRequired: true }),
                    directives: [
                        readonly(true)
                    ]
                }),
                updatedBy: new Field({
                    returnType: GraphqlType.awsDateTime({ isRequired: true }),
                    directives: [
                        readonly(true)
                    ]
                })
            },
            // Auth doesn't seem to do anything. Delete.
            // directives: [
            //     // auth([
            //     //     { allow: 'private', provider: 'iam' }
            //     // ])
            // ]
        });
        this.types.interfaceTypes['MNode'] = MNode;

        const MMovie = new ObjectType('MMovie', {
            interfaceTypes: [MNode],
            definition: {
                name: GraphqlType.string({ isRequired: true }),
                boolean: GraphqlType.boolean(),
                float: GraphqlType.float(),
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
                mMovieActors: new ResolvableField({
                    // A movie must have actors.
                    returnType: jompx.JompxGraphqlType.objectType({ typeName: 'MMovieActor', isList: true, isRequiredList: true }), // String return type.
                    dataSource: this.datasources['mySql'],
                    directives: [
                        lookup({ from: 'MMovieActor', localField: 'id', foreignField: 'movieId' })
                    ]
                })
            },
            directives: [
                auth([
                    { allow: 'private', provider: 'iam' },
                    { allow: 'private', provider: 'userPool', groups: ['admin'] }
                ]),
                datasource('mySql'),
                source('movie'),
                operation(['find', 'findOne', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'upsertOne', 'upsertMany', 'deleteOne', 'deleteMany'])
            ]
        });
        this.types.objectTypes['MMovie'] = MMovie;

        const MMovieActor = new ObjectType('MMovieActor', {
            interfaceTypes: [MNode],
            definition: {
                movieId: GraphqlType.id({ isRequired: true }),
                actorId: GraphqlType.id({ isRequired: true }),
                mMovie: new ResolvableField({
                    returnType: MMovie.attribute({ isRequired: true }),
                    dataSource: this.datasources['mySql'],
                    directives: [
                        lookup({ from: 'MMovie', localField: 'movieId', foreignField: 'id' })
                    ]
                }),
                mActor: new ResolvableField({
                    returnType: jompx.JompxGraphqlType.objectType({ typeName: 'MActor', isRequired: true }),
                    dataSource: this.datasources['mySql'],
                    directives: [
                        lookup({ from: 'MActor', localField: 'actorId', foreignField: 'id' })
                    ]
                })
            },
            directives: [
                auth([
                    { allow: 'private', provider: 'iam' },
                    { allow: 'private', provider: 'userPool', groups: ['admin'] }
                ]),
                datasource('mySql'),
                source('movieActor'),
                operation(['find', 'findOne', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'upsertOne', 'upsertMany', 'deleteOne', 'deleteMany'])
            ]
        });
        this.types.objectTypes['MMovieActor'] = MMovieActor;

        const MActor = new ObjectType('MActor', {
            interfaceTypes: [MNode],
            definition: {
                name: GraphqlType.string({ isRequired: true }),
                // An actor can have 0 or more movies.
                mMovieActors: new ResolvableField({
                    returnType: MMovieActor.attribute({ isList: true }),
                    dataSource: this.datasources['mySql'],
                    directives: [
                        lookup({ from: 'MMovieActor', localField: 'id', foreignField: 'actorId' })
                    ]
                })
            },
            directives: [
                auth([
                    { allow: 'private', provider: 'iam' },
                    { allow: 'private', provider: 'userPool', groups: ['admin'] }
                ]),
                datasource('mySql'),
                source('actor'),
                operation(['find', 'findOne', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'upsertOne', 'upsertMany', 'deleteOne', 'deleteMany'])
            ]
        });
        this.types.objectTypes['MActor'] = MActor;
    }
}
