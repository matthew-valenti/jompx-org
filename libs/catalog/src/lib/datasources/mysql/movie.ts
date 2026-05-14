import * as jompx from '@jompx/constructs';

export const movieEntity: jompx.CatalogEntity = {
  movie: {
    api: {
      entityNamePrefix: 'mysql',
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
      int: {
        api: {
          returnType: 'int',
        },
        authorization: {
          includeInCatalog: true,
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
        authorization: {
          includeInCatalog: true,
          dataType: 'Set<String>',
        },
      },
      relatedMovies: {
        api: {
          returnType: { type: 'complexAttribute', name: 'relatedMovie' },
          returnTypeOptions: { isList: true },
        },
      },
    },
    relationships: {
      movieActors: {
        relatedEntity: 'movieActor',
        type: '1-N',
        cardinality: '0',
        condition: { localField: 'id', foreignField: 'movieId' },
        authorization: {
          includeInCatalog: true,
        },
      },
      poster: {
        relatedEntity: 'file',
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
        authorization: {
          includeInCatalog: true,
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
        authorization: {
          includeInCatalog: true,
        },
      },
    },
  },
} as const;
