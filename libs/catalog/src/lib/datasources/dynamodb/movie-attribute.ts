// import { z } from 'zod';
import * as jompx from '@jompx/constructs';

export const movieAttributeEntity: jompx.CatalogEntity = {
  movieAttribute: {
    api: {
      entityNamePrefix: 'dynamodb',
      operations: [{ type: 'find' }, { type: 'findOne' }],
      defaultIncludeInApis: ['admin', 'api'],
    },
    attributes: {
      attribute1: {
        api: {
          returnType: 'string',
        },
      },
      attribute2: {
        api: {
          returnType: 'string',
        },
      },
      attribute3: {
        api: {
          returnType: 'int',
        },
      },
      attribute4: {
        api: {
          returnType: 'string',
          returnTypeOptions: { isList: true },
        },
      },
      attribute5: {
        api: {
          returnType: 'string',
          returnTypeOptions: { isList: true },
          //   directives: [set('string')],
        },
      },
    },
  },
} as const;
