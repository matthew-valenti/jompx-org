// import { z } from 'zod';
import * as jompx from '@jompx/constructs';

export const movieEntity: jompx.CatalogEntity = {
  movie: {
    api: {
      entityNamePrefix: 'mongodb',
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
    commonAttributes: ['mid', 'audit'],
    attributes: {
      name: {
        api: {
          returnType: 'string',
          returnTypeOptions: { isRequired: true },
        },
      },
      genre: {
        api: {
          returnType: { type: 'enum', name: 'movieGenre' },
        },
      },
      boolean: {
        api: {
          returnType: 'boolean',
        },
      },
      float: {
        api: {
          returnType: 'float',
        },
      },
      int: {
        api: {
          returnType: 'int',
        },
      },
      date: {
        api: {
          returnType: 'date',
        },
      },
      dateTime: {
        api: {
          returnType: 'datetime',
        },
      },
      email: {
        api: {
          returnType: 'email',
        },
      },
      ipAddress: {
        api: {
          returnType: 'ipaddress',
        },
      },
      json: {
        api: {
          returnType: 'json',
        },
      },
      phone: {
        api: {
          returnType: 'phone',
        },
      },
      time: {
        api: {
          returnType: 'time',
        },
      },
      timestamp: {
        api: {
          returnType: 'timestamp',
        },
      },
      url: {
        api: {
          returnType: 'url',
        },
      },
      physical: {
        physicalName: 'physicalFieldName',
        api: {
          returnType: 'string',
        },
      },
      owners: {
        api: {
          returnType: 'string',
          returnTypeOptions: { isList: true },
        },
      },
    },
    relationships: {
      movieActors: {
        relatedEntity: 'movieActor',
        type: '1-N',
        cardinality: '0',
        condition: { localField: '_id', foreignField: 'movieId' },
      },
      poster: {
        relatedEntity: 'file',
        type: '1-1',
        cardinality: '0',
        condition: {
          let: { mongodbMovie_id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$entityName', 'MongodbMovie'] },
                    { $eq: ['$entityId', '$$mongodbMovie_id'] },
                    { $eq: ['$entityKey', 'poster'] },
                  ],
                },
              },
            },
          ],
        },
      },
      clicks: {
        relatedEntity: 'analytics',
        relatedEntityDatasource: 'dynamodb',
        type: '1-N',
        cardinality: '0',
        condition: {
          let: { mysqlMovie_id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$entityId', '$$mysqlMovie_id'] },
                    { $eq: ['$entityName', 'movie'] },
                    { $eq: ['$action', 'click'] },
                  ],
                },
              },
            },
          ],
        },
      },
    },
  },
} as const;
