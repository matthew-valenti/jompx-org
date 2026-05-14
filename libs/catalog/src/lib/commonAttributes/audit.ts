import { CatalogCommonAttribute } from '@jompx/constructs';

export const audit: CatalogCommonAttribute = {
  audit: {
    api: {
      includeInApis: ['admin', 'api'],
    },
    attributes: {
      //   id: {
      //     api: {
      //       returnType: 'id',
      //       returnTypeOptions: { isRequired: true },
      //       isReadOnly: true,
      //     },
      //   },
      createdAt: {
        api: {
          returnType: 'datetime',
          returnTypeOptions: { isRequired: true },
          isReadOnly: true,
          defaultValue: { onInsert: { $ifNull: ['$$NOW'] } },
        },
      },
      createdBy: {
        api: {
          returnType: 'string',
          returnTypeOptions: { isRequired: true },
        },
      },
      updatedAt: {
        api: {
          returnType: 'datetime',
          returnTypeOptions: { isRequired: true },
          isReadOnly: true,
          defaultValue: { onInsert: { $ifNull: ['$$NOW'] }, onUpdate: { $ifNull: ['$$NOW'] } },
        },
      },
      updatedBy: {
        api: {
          returnType: 'string',
          returnTypeOptions: { isRequired: true },
        },
      },
    },
  },
};
