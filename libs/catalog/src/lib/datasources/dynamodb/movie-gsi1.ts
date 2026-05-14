// import { z } from 'zod';
import * as jompx from '@jompx/constructs';

export const movieGsi1Entity: jompx.CatalogEntity = {
  movieGsi1: {
    physicalName: 'gsi1',
    api: {
      entityNamePrefix: 'dynamodb',
      operations: [{ type: 'find' }, { type: 'findOne' }],
      defaultIncludeInApis: ['admin', 'api'],
    },
    compositeEntityName: 'movie',
    commonAttributes: ['id'],
    attributes: {
      name: {
        api: {
          returnType: 'string',
          returnTypeOptions: { isRequired: true },
        },
      },
    },
  },
} as const;
