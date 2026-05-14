import { CatalogCommonAttribute } from '@jompx/constructs';

export const id: CatalogCommonAttribute = {
  id: {
    api: {
      includeInApis: ['admin', 'api'],
    },
    attributes: {
      id: {
        api: {
          returnType: 'id',
          returnTypeOptions: { isRequired: true },
          isReadOnly: true,
        },
      },
    },
  },
};
