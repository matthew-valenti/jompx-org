import * as jompx from '@jompx/constructs';

export const relatedMovie: jompx.CatalogComplexAttribute = {
  relatedMovie: {
    api: {
      defaultIncludeInApis: ['admin', 'api'],
    },
    authorization: {
      includeInCatalog: true,
    },
    commonAttributes: ['id'],
    attributes: {
      relatedMovieId: {
        api: {
          returnType: 'id',
          returnTypeOptions: { isRequired: true },
        },
      },
    },
    relationships: {
      movie: {
        relatedEntity: 'movie',
        relatedEntityDatasource: 'mysql',
        type: '1-N',
        cardinality: '1',
        condition: { localField: 'relatedMovieId', foreignField: 'id' },
      },
    },
  },
};
