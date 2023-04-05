import * as jompx from '@jompx/constructs';
import { auth, datasource, defaultValue, lookup, operation, readonly, source } from '@jompx/constructs'; // Custom directives.
import { Field, GraphqlType, InterfaceType, ObjectType, ResolvableField } from '@aws-cdk/aws-appsync-alpha';

export class MySqlSchema {

    public types: jompx.SchemaTypes = { enumTypes: {}, inputTypes: {}, interfaceTypes: {}, objectTypes: {}, unionTypes: {} };

    constructor(
        private datasources: jompx.DataSource
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
                        readonly(true),
                        defaultValue({ onInsert: { $ifNull: ['$$NOW'] } })
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
                        readonly(true),
                        defaultValue({ onInsert: { $ifNull: ['$$NOW'] }, onUpdate: { $ifNull: ['$$NOW'] } })
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
            //     //     { type: 'iam' }
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
                owners: new Field({
                    returnType: GraphqlType.string({ isList: true })
                }),
                mMovieActors: new ResolvableField({
                    // A movie must have actors.
                    returnType: jompx.JompxGraphqlType.objectType({ typeName: 'MMovieActor', isList: true, isRequiredList: true }), // String return type.
                    dataSource: this.datasources['mysql'].lambdaDataSource,
                    directives: [
                        lookup({ from: 'MMovieActor', localField: 'id', foreignField: 'movieId' })
                    ]
                }),
                poster: new ResolvableField({
                    returnType: jompx.JompxGraphqlType.objectType({ typeName: 'MFile' }),
                    dataSource: this.datasources['mysql'].lambdaDataSource,
                    directives: [
                        lookup({
                            from: 'MFile', let: { myMovieId: "$id" }, pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$entityName", "MMovie"] },
                                                { $eq: ["$entityId", "$$myMovieId"] },
                                                { $eq: ["$entityKey", "poster"] }
                                            ]
                                        }
                                    }
                                }
                            ]
                        })
                    ]
                }),
                clicks: new ResolvableField({
                    returnType: jompx.JompxGraphqlType.objectType({ typeName: 'DMovieAnalytics', isList: true }),
                    dataSource: this.datasources['dynamodb'].lambdaDataSource,
                    directives: [
                        lookup({
                            from: 'DMovieAnalytics', let: { myMovieId: "$id" }, pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$movieId", "$$myMovieId"] },
                                                { $eq: ["$action", "click"] }
                                            ]
                                        }
                                    }
                                }
                            ]
                        })
                    ]
                })
            },
            directives: [
                auth([
                    // { type: 'iam', actions: ['create', 'read', 'update', 'delete'], condition: { $expr: { $in: ['$$event.identity.username', '$owners'] } } },
                    // { type: 'userPool', props: { groups: ['admin'] }, actions: ['create', 'read', 'update', 'delete'], condition: { $expr: { $in: ['$$event.identity.username', '$owners'] } } },
                    { type: 'iam', actions: ['*'], comment: 'Full access.' },
                    { type: 'userPool', props: { groups: ['admin'] }, actions: ['*'], comment: 'Group admin has full access.' },
                    { type: 'userPool', props: { groups: ['author'] }, actions: ['create', 'read', 'update'], condition: { $expr: { $in: ['$$event.identity.username', '$owners'] } }, 'comment': 'Group author has access owned movies only. and cannot delete.' },
                    { type: 'userPool', props: { groups: ['user'] }, actions: ['read'], 'comment': 'Group user can read all.' },
                    { type: 'userPool', props: { groups: ['guest'] }, actions: ['read'], 'comment': 'Group user can read all.' },
                ]),
                datasource('mysql'),
                source('movie'),
                operation(['find', 'findOne', 'insertOne', 'insertMany', 'upsertOne', 'upsertMany', 'updateOne', 'updateMany', 'deleteOne', 'deleteMany'])
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
                    dataSource: this.datasources['mysql'].lambdaDataSource,
                    directives: [
                        lookup({ from: 'MMovie', localField: 'movieId', foreignField: 'id' })
                    ]
                }),
                mActor: new ResolvableField({
                    returnType: jompx.JompxGraphqlType.objectType({ typeName: 'MActor', isRequired: true }),
                    dataSource: this.datasources['mysql'].lambdaDataSource,
                    directives: [
                        lookup({ from: 'MActor', localField: 'actorId', foreignField: 'id' })
                    ]
                })
            },
            directives: [
                auth([
                    { type: 'iam' },
                    { type: 'userPool', props: { groups: ['*'] } },
                ]),
                datasource('mysql'),
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
                    dataSource: this.datasources['mysql'].lambdaDataSource,
                    directives: [
                        lookup({ from: 'MMovieActor', localField: 'id', foreignField: 'actorId' })
                    ]
                })
            },
            directives: [
                auth([
                    { type: 'iam' },
                    { type: 'userPool', props: { groups: ['*'] } },
                ]),
                datasource('mysql'),
                source('actor'),
                operation(['find', 'findOne', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'upsertOne', 'upsertMany', 'deleteOne', 'deleteMany'])
            ]
        });
        this.types.objectTypes['MActor'] = MActor;

        const MFile = new ObjectType('MFile', {
            interfaceTypes: [MNode],
            definition: {
                entityName: GraphqlType.string({ isRequired: true }),
                entityId: GraphqlType.string({ isRequired: true }),
                entityKey: GraphqlType.string({ isRequired: true }),
                filename: GraphqlType.string({ isRequired: true }),
            },
            directives: [
                auth([
                    { type: 'iam' },
                    { type: 'userPool', props: { groups: ['*'] } },
                ]),
                datasource('mysql'),
                source('file'),
                operation(['find', 'findOne', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'upsertOne', 'upsertMany', 'deleteOne', 'deleteMany'])
            ]
        });
        this.types.objectTypes['MFile'] = MFile;
    }
}
