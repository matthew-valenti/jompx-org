import * as jompx from '@jompx/constructs';

import { actorEntity } from './actor';
import { analyticsEntity } from './analytics';
import { movieEntity } from './movie';
import { movieActorEntity } from './movie-actor';
import { movieAttributeEntity } from './movie-attribute';
import { movieGsi1Entity } from './movie-gsi1';

export const dynamodbEntities: jompx.CatalogEntity = {
  ...actorEntity,
  ...analyticsEntity,
  ...movieEntity,
  ...movieActorEntity,
  ...movieAttributeEntity,
  ...movieGsi1Entity,
};
