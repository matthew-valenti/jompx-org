import * as jompx from '@jompx/constructs';
import { movieGenre } from './movie-genre';

export const enums: jompx.CatalogEnum = {
  ...movieGenre,
};
