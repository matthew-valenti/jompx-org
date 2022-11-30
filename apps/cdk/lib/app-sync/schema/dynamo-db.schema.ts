import * as jompx from '@jompx/constructs';
import { auth, datasource, lookup, operation, partitionKey, readonly, secondaryIndex, set, source, sortKey } from '@jompx/constructs'; // Custom directives.
import { Field, GraphqlType, InterfaceType, ObjectType, ResolvableField, } from '@aws-cdk/aws-appsync-alpha';
// import { tag } from '../directives';

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
                    // directives: [
                    //     partitionKey(true)
                    // ]
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

        const DMovieAttributes = new ObjectType('DMovieAttributes', {
            definition: {
                attribute1: new Field({
                    returnType: GraphqlType.string()
                }),
                attribute2: new Field({
                    returnType: GraphqlType.string()
                }),
                attribute3: new Field({
                    returnType: GraphqlType.int()
                }),
                attribute4: new Field({
                    returnType: GraphqlType.string({ isList: true })
                }),
                attribute5: new Field({
                    returnType: GraphqlType.string({ isList: true }),
                    directives: [
                        set('string')
                    ]
                })
            }
        });
        this.types.objectTypes['DMovieAttributes'] = DMovieAttributes;

        const expr = {
            $expr: {
                $eq: [
                    "$myField",
                    "$myOtherField"
                ]
            }
        };

        // const expr2 = { owner: { $eq: 'stack.cognitoSub' } };
        // const expr3 = { groups: { $in: ['stack.cognitoGroups'] } };
        // const expr4 = { owner: { $eq: 'stack.cognitoSub' } };
        // public key OR public iam allows "UnAuthenticated Role" from Cognito Identity Pools for public access instead of an API Key. 
        // private cognito OR iam allows "uthenticated Role" from Cognito Identity Pools for private access
        // { allow: 'private', provider: 'iam', ownersField: 'owners', ownerClaim: 'sub::username' },
        // 1. deny all.
        // 2. allow 

        const DMovie = new ObjectType('DMovie', {
            interfaceTypes: [DNode],
            definition: {
                // name: GraphqlType.string({ isRequired: true }),
                name: new Field({
                    returnType: GraphqlType.string({ isRequired: true }),
                    directives: [
                        auth([
                            { allow: 'private', provider: 'iam', ownersField: 'owners', ownerClaim: 'sub::username' },
                            // { allow: 'private', provider: 'userPool', groups: ['admin'] }
                            { allow: 'private', provider: 'apiKey' },
                        ]),
                        // sortKey(true),
                        // tag('test')
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
                // json: GraphqlType.awsJson(),
                phone: GraphqlType.awsPhone(),
                time: GraphqlType.awsTime(),
                timestamp: GraphqlType.awsTimestamp(),
                url: GraphqlType.awsUrl(),
                sourceField: new Field({
                    returnType: GraphqlType.string(),
                    directives: [
                        source('source')
                    ]
                }),
                list: GraphqlType.string({ isList: true }),
                attributes: new Field({
                    returnType: DMovieAttributes.attribute(),
                }),
                owners: new Field({
                    returnType: GraphqlType.string({ isList: true }),
                    directives: [
                        set('string')
                    ]
                }),
                groups: new Field({
                    returnType: GraphqlType.string({ isList: true }),
                    directives: [
                        set('string')
                    ]
                }),
                dMovieActors: new ResolvableField({
                    // A movie must have actors.
                    returnType: jompx.JompxGraphqlType.objectType({ typeName: 'DMovieActor', isList: true, isRequiredList: true }), // String return type example.
                    dataSource: this.datasources['dynamoDb'],
                    directives: [
                        lookup({ from: 'DMovieActor', localField: 'id', foreignField: 'movieId', pipeline: {} })
                    ]

                    /*
                    $lookup:
                        {
                        from: "warehouses",
                        let: { order_item: "$item", order_qty: "$ordered" },
                        pipeline: [
                            { $match:
                                { $expr:
                                    { $and:
                                    [
                                        { $eq: [ "$stock_item",  "$$order_item" ] },
                                        { $gte: [ "$instock", "$$order_qty" ] }
                                    ]
                                    }
                                }
                            },
                            { $project: { stock_item: 0, _id: 0 } }
                        ],
                        as: "stockdata"
                        }
                    }
                    */
                })
            },
            directives: [
                auth([
                    { allow: 'private', provider: 'iam' },
                    { allow: 'private', provider: 'userPool', groups: ['*'] },
                    { allow: 'private', provider: 'apiKey' }
                ]),
                datasource('dynamoDb'),
                source('movie'),
                operation(['findCursor', 'findOne', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'upsertOne', 'upsertMany', 'deleteOne', 'deleteMany']),
                // tag('test')
            ]
        });
        this.types.objectTypes['DMovie'] = DMovie;

        const DMovieIndex = new ObjectType('DMovieIndex', {
            interfaceTypes: [DNode],
            definition: {
                name: GraphqlType.string({ isRequired: true })
            },
            directives: [
                auth([
                    { allow: 'private', provider: 'iam' },
                    { allow: 'private', provider: 'userPool', groups: ['admin'] }
                ]),
                datasource('dynamoDb'),
                source('movie'),
                secondaryIndex('movieIndex'),
                operation(['findCursor'])
            ]
        });
        this.types.objectTypes['DMovieIndex'] = DMovieIndex;

        const DMovieActor = new ObjectType('DMovieActor', {
            interfaceTypes: [DNode],
            definition: {
                movieId: GraphqlType.id({ isRequired: true }),
                actorId: GraphqlType.id({ isRequired: true }),
                dMovie: new ResolvableField({
                    returnType: DMovie.attribute({ isRequired: true }),
                    dataSource: this.datasources['dynamoDb'],
                    directives: [
                        lookup({ from: 'DMovie', localField: 'movieId', foreignField: 'id' })
                    ]
                }),
                dActor: new ResolvableField({
                    returnType: jompx.JompxGraphqlType.objectType({ typeName: 'DActor', isRequired: true }), // String return type example.
                    dataSource: this.datasources['dynamoDb'],
                    directives: [
                        lookup({ from: 'DActor', localField: 'actorId', foreignField: 'id' })
                    ]
                })
            },
            directives: [
                auth([
                    { allow: 'private', provider: 'iam' },
                    { allow: 'private', provider: 'userPool', groups: ['admin'] }
                ]),
                datasource('dynamoDb'),
                source('movieActor'),
                operation(['findCursor', 'findOne', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'upsertOne', 'upsertMany', 'deleteOne', 'deleteMany'])
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
                    dataSource: this.datasources['dynamoDb'],
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
                datasource('dynamoDb'),
                source('actor'),
                operation(['findCursor', 'findOne', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'upsertOne', 'upsertMany', 'deleteOne', 'deleteMany'])
            ]
        });
        this.types.objectTypes['DActor'] = DActor;
    }
}
