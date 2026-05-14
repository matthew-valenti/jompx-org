import * as jompx from '@jompx/constructs';

export const movieActorEntity: jompx.CatalogEntity = {
  movieActor: {
    api: {
      entityNamePrefix: 'dynamodb',
      operations: [{ type: 'find' }, { type: 'findOne' }],
      defaultIncludeInApis: ['admin', 'api'],
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
        type: '1-N',
        cardinality: '1',
        condition: { localField: 'movieId', foreignField: 'id' },
      },
      actor: {
        relatedEntity: 'actor',
        type: '1-N',
        cardinality: '1',
        condition: { localField: 'actorId', foreignField: 'id' },
      },
    },
  },
};
