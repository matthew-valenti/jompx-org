// import { z } from 'zod';
import * as jompx from '@jompx/constructs';

export const movieEntity: jompx.CatalogEntity = {
  movie: {
    api: {
      entityNamePrefix: 'dynamodb',
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
    commonAttributes: ['id', 'audit'],
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
      decimal: {
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
          //   directives: [set('string')],
        },
      },
      tags: {
        api: {
          returnType: 'string',
          returnTypeOptions: { isList: true },
        },
        meta: { description: 'DynamoDB "String Set" type.' },
      },
      list: {
        api: {
          returnType: 'json',
          returnTypeOptions: { isList: true },
        },
        meta: { description: 'DynamoDB "List" type.' },
      },
      meta: {
        api: {
          returnType: {
            name: 'movieMeta',
            type: 'complexAttribute',
            definition: {
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
                    returnType: 'json',
                    returnTypeOptions: { isList: true },
                  },
                },
                attribute5: {
                  api: {
                    returnType: 'string',
                    returnTypeOptions: { isList: true },
                    // directives: [set('string')],
                    // but i think it's better to retool this to list.
                    // i know this conflicts with isList but isList = array of typed values.
                    // DynamoDB list is excotic and is an array of any type.
                  },
                },
              },
            },
          },
        },
      },
    },
    relationships: {
      movieActors: {
        relatedEntity: 'movieActor',
        type: '1-N',
        cardinality: '0',
        condition: { localField: 'id', foreignField: 'movieId' },
      },
      files: {
        relatedEntity: 'file',
        relatedEntityDatasource: 'mysql',
        type: '1-N',
        cardinality: '0',
        condition: {
          let: { mysqlMovie_id: '$id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$entityName', 'MysqlMovie'] },
                    { $eq: ['$entityId', '$$mysqlMovie_id'] },
                    { $eq: ['$entityKey', 'poster'] },
                  ],
                },
              },
            },
          ],
        },
      },
      poster: {
        relatedEntity: 'file',
        relatedEntityDatasource: 'mysql',
        type: '1-1',
        cardinality: '0',
        condition: {
          let: { mysqlMovie_id: '$id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$entityName', 'MysqlMovie'] },
                    { $eq: ['$entityId', '$$mysqlMovie_id'] },
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
          let: { mysqlMovie_id: '$id' },
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
