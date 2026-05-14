import * as jompx from '@jompx/constructs';

import { fileEntity } from './file';
import { movieEntity } from './movie';
import { movieActorEntity } from './movie-actor';
import { actorEntity } from './actor';

export const mongodbEntities: jompx.CatalogEntity = {
  ...actorEntity,
  ...fileEntity,
  ...movieEntity,
  ...movieActorEntity,
};
