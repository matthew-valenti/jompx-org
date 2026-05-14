// import { z } from 'zod';
import * as jompx from '@jompx/constructs';

export const analyticsEntity: jompx.CatalogEntity = {
  analytics: {
    api: {
      entityNamePrefix: 'dynamodb',
      operations: [{ type: 'find' }, { type: 'findOne' }],
      defaultIncludeInApis: ['admin', 'api'],
    },
    authorization: {
      includeInCatalog: true,
    },
    attributes: {
      entityName: {
        api: {
          returnType: 'string',
          returnTypeOptions: { isRequired: true },
        },
      },
      entityId: {
        api: {
          returnType: 'string',
          returnTypeOptions: { isRequired: true },
        },
      },
      timestamp: {
        api: {
          returnType: 'timestamp',
          returnTypeOptions: { isRequired: true },
        },
      },
      action: {
        api: {
          returnType: 'string',
        },
      },
    },
  },
} as const;
