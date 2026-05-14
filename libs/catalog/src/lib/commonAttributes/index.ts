import * as jompx from '@jompx/constructs';
import { id } from './id';
import { mid } from './mid';
import { audit } from './audit';

export const commonAttributes: jompx.CatalogCommonAttribute = {
  ...id,
  ...mid,
  ...audit,
};
