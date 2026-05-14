// Schema defined with TypeBox → JSON Schema → runtime validation (AJV)
// AJV validation uses ./generated/schema.generated.json

import { Type, Static } from '@sinclair/typebox';

export const Organization = Type.Object({
    id: Type.String(),
    name: Type.String(),
});

export const Email = Type.Object({
    email: Type.String({ format: 'email' }),
    tags: Type.Array(Type.String()),
});

export const Environment = Type.Object({
    accountId: Type.String(),
    region: Type.String(),
    name: Type.String(),
    cidr: Type.Optional(Type.String()),
});

export const Pipeline = Type.Object({
    environmentName: Type.String(),
    stages: Type.Array(Type.String()),
});

export const Certificate = Type.Object({
    rootDomain: Type.String(),
});

export const Common = Type.Object(
    {
        organization: Organization,
        emails: Type.Array(Email),
        environments: Type.Array(Environment),
        pipelines: Type.Array(Pipeline),
        certificates: Type.Array(Certificate),
    },
    { additionalProperties: false }
);

export const Sandbox = Type.Object({}, { additionalProperties: false });
export const Test = Type.Object({}, { additionalProperties: false });
export const Prod = Type.Object({}, { additionalProperties: false });

export const ConfigSchema = Type.Object(
    {
        common: Common,
        environments: Type.Object(
            {
                sandbox: Sandbox,
                test: Test,
                prod: Prod,
            },
            { additionalProperties: false }
        ),
    },
    { $id: 'Config', additionalProperties: false }
);

export type Config = Static<typeof ConfigSchema>;
