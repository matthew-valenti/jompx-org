import * as jompx from '@jompx/constructs';

export const movieActorEntity: jompx.CatalogEntity = {
    movieActor: {
        physicalName: 'movie_actor',
        api: {
            entityNamePrefix: 'mysql',
            operations: [
                { type: 'find' },
                { type: 'findOne' },
                { type: 'insertOne' },
                { type: 'insertMany' },
                { type: 'updateOne' },
                { type: 'updateMany' },
                { type: 'upsertOne' },
                { type: 'upsertMany' },
                { type: 'deleteOne' },
                { type: 'deleteMany' },
            ],
            defaultIncludeInApis: ['admin', 'api'],
        },
        authorization: {
            includeInCatalog: true,
        },
        commonAttributes: ['id', 'audit'],
        attributes: {
            movieId: {
                api: {
                    returnType: 'id',
                    returnTypeOptions: { isRequired: true },
                },
            },
            actorId: {
                api: {
                    returnType: 'id',
                    returnTypeOptions: { isRequired: true },
                },
            },
        },
        relationships: {
            movie: {
                relatedEntity: 'movie',
                type: '1-1',
                cardinality: '1',
                condition: { localField: 'movieId', foreignField: 'id' },
                authorization: {
                    includeInCatalog: true,
                },
            },
            actor: {
                relatedEntity: 'actor',
                type: '1-1',
                cardinality: '1',
                condition: { localField: 'actorId', foreignField: 'id' },
                authorization: {
                    includeInCatalog: true,
                },
            },
        },
    },
};
