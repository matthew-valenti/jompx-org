import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
  {
    files: ['**/*.graphql'],
    plugins: {
      '@graphql-eslint': require('@graphql-eslint/eslint-plugin'),
    },
    languageOptions: {
      parser: require('@graphql-eslint/eslint-plugin'),
      parserOptions: {
        schema: 'src/schema.graphql',
        documents: ['src/**/*.graphql'],
      },
    },
    extends: [
      'plugin:@graphql-eslint/schema-recommended',
      'plugin:@graphql-eslint/operations-recommended',
    ],
    rules: {
      '@graphql-eslint/no-deprecated': 'warn',
      '@graphql-eslint/no-unused-fragments': 'error',
    },
  },
];
