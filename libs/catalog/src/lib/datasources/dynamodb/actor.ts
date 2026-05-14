// import { z } from 'zod';
import * as jompx from '@jompx/constructs';

export const actorEntity: jompx.CatalogEntity = {
  actor: {
    api: {
      entityNamePrefix: 'dynamodb',
      operations: [{ type: 'find' }, { type: 'findOne' }],
      defaultIncludeInApis: ['admin', 'api'],
    },
    commonAttributes: ['id', 'audit'],
    attributes: {
      name: {
        api: {
          returnType: 'string',
          returnTypeOptions: { isRequired: true },
        },
      },
    },
    relationships: {
      movieActors: {
        relatedEntity: 'movieActor',
        type: '1-N',
        cardinality: '0',
        condition: { localField: 'id', foreignField: 'actorId' },
      },
    },
  },
} as const;
