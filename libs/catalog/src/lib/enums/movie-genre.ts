import { CatalogEnum } from '@jompx/constructs';

export const movieGenre: CatalogEnum = {
  movieGenre: {
    description: 'Movie genres.',
    values: [{ value: 'COMEDY' }, { value: 'DRAMA' }, { value: 'HORROR' }],
    api: {
      includeInApis: ['admin', 'api'],
    },
  },
};
