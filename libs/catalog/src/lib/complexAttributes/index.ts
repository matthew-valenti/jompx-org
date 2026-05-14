import * as jompx from '@jompx/constructs';
import { relatedMovie } from './related-movie';

export const complexAttributes: jompx.CatalogComplexAttribute = {
  ...relatedMovie,
};
