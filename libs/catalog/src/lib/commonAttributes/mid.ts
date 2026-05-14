import { CatalogCommonAttribute } from '@jompx/constructs';

export const mid: CatalogCommonAttribute = {
  mid: {
    api: {
      includeInApis: ['admin', 'api'],
    },
    attributes: {
      _id: {
        api: {
          returnType: 'id',
          returnTypeOptions: { isRequired: true },
          isReadOnly: true,
        },
      },
    },
  },
};
