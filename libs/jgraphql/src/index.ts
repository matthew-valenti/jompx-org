import { workspaceRoot } from '@nx/devkit';
import * as path from 'path';

export const apiGraphqlSchemaFilePath = path.join(
    workspaceRoot,
    'libs/jgraphql/src/lib/api/schema/api.schema.graphql',
);

export const apiSchemaIntrospectionFilePath = path.join(
    workspaceRoot,
    'libs/jgraphql/src/lib/api/generated/api.schema.introspection.json',
);

export const apiSchemaDirectivesFilePath = path.join(
    workspaceRoot,
    'libs/jgraphql/src/lib/api/generated/api.schema.directives.json'
);
