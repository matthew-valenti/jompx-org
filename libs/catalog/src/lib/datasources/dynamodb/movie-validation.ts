import { z } from 'zod';
import { movieEntity } from './movie';

// Entity level validation.

// Entity level validation.
movieEntity['mysqlMovie'].validationRules = (data: any, ctx: z.RefinementCtx): void => {
  // Cross-attribute validation: if `isActive` is true, `name` is required
  if (data.isActive && !data.name) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Name is required when isActive is true.',
      path: ['name'], // Point to the 'name' attribute in the error
    });
  }

  // Example of additional entity-level rule: `releaseYear` must be a reasonable value
  if (data.releaseYear && data.releaseYear < 1888) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Release year must be 1888 or later.',
      path: ['releaseYear'],
    });
  }
};

// Attribute level validation

const attributes = movieEntity['mysqlMovie'].attributes;
attributes['name'].validationRules = z.string().min(1, 'This field is required');

/*
Attribute level validation example:

const schema = z.object(
  Object.fromEntries(
    Object.entries(attributes).map(([key, attr]) => [key, attr.validationRules])
  )
);
 
const data = {
  username: "john_doe",
  age: 25,
  email: "john@example.com",
};

type ValidatedData = z.infer<typeof schema>;
const validatedData: ValidatedData = schema.parse(data);
// Now `validatedData` is type-safe, matching the Zod schema
// If invalid, Zod will throw with detailed errors
*/

/*
Entity level validation example:

const buildEntitySchema = (entity: SchemaEntityProps) => {
  // Create a Zod object schema from the entity's attributes
  const attributeSchema = z.object(
    Object.fromEntries(
      entity.attributes.map(attr => [attr.name, attr.validationRules]) // Map attributes to Zod validation rules
    )
  );

  // Apply cross-attribute or entity-level validation
  const entitySchema = attributeSchema.superRefine((data, ctx) => {
    // Example cross-attribute validation: `name` required if `isActive` is true
    if (data.isActive && !data.name) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Name is required when isActive is true.",
        path: ['name'],
      });
    }

    // Additional cross-attribute validations can be added here
  });

  return entitySchema;
};
*/

/*
// Merge rules example.

import { z } from 'zod';

// Entity-level validation (across all attributes)
const entityCommon = z.object({}).superRefine((data, ctx) => {
  if (data.attribute1 && data.attribute2 && data.attribute1 > data.attribute2) {
    ctx.addIssue({
      path: ['attribute1'],
      message: 'attribute1 should not be greater than attribute2',
    });
  }
});

// Attribute-level common rules (could be empty or dynamic)
const attributeCommon = z.object({
  attribute1: z.number().min(1).max(10).optional(), // example rule
  attribute2: z.number().optional(), // example rule
});

// Attribute-specific rules (could be empty or dynamic)
const attributeSpecific = z.object({
  attribute1: z.string().max(50), // overrides attribute1 common rule
});
 
// Function to handle merging, including empty schemas
const createDynamicSchema = (entityCommon: z.ZodObject<any> | undefined, attributeCommon: z.ZodObject<any> | undefined, attributeSpecific: z.ZodObject<any> | undefined) => {
  // Default to empty schemas if undefined
  const commonSchema = attributeCommon || z.object({});
  const specificSchema = attributeSpecific || z.object({});

  // Merge common and specific attribute rules
  const mergedAttributes = commonSchema.merge(specificSchema);

  // Merge with entityCommon, or just use mergedAttributes if entityCommon is empty
  return entityCommon ? entityCommon.merge(mergedAttributes) : mergedAttributes;
};

// Dynamically combine entityCommon, attributeCommon, and attributeSpecific
const combinedSchema = createDynamicSchema(entityCommon, attributeCommon, attributeSpecific);

// Example object to validate
const objectToValidate = {
  attribute1: "example",  // passes specific (string, max 50)
  attribute2: 5           // passes common rule (number)
};

// Validate object
const result = combinedSchema.safeParse(objectToValidate);

console.log(result);

*/
