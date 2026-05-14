import { z } from 'zod';
import { movieEntity } from './movie';

// Attribute level validation

const attributes = movieEntity['mysqlMovie'].attributes;
attributes['name'].validationRules = z.string().min(1, 'This field is required');
