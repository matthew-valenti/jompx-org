import * as jompx from '@jompx/constructs';

import { actorEntity } from './actor';
import { fileEntity } from './file';
import { movieEntity } from './movie';
import { movieActorEntity } from './movie-actor';

export const mysqlEntities: jompx.CatalogEntity = {
  ...actorEntity,
  ...fileEntity,
  ...movieEntity,
  ...movieActorEntity,
};
