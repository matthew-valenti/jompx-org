// import { z } from 'zod';
import * as jompx from '@jompx/constructs';

export const fileEntity: jompx.CatalogEntity = {
  file: {
    api: {
      entityNamePrefix: 'mongodb',
      operations: [{ type: 'find' }, { type: 'findOne' }],
      defaultIncludeInApis: ['admin', 'api'],
    },
    commonAttributes: ['mid', 'audit'],
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
      entityKey: {
        api: {
          returnType: 'string',
          returnTypeOptions: { isRequired: true },
        },
      },
      filename: {
        api: {
          returnType: 'string',
          returnTypeOptions: { isRequired: true },
        },
      },
    },
  },
} as const;
