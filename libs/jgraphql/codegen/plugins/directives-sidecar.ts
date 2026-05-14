// directives-sidecar.ts
import type { PluginFunction } from "@graphql-codegen/plugin-helpers";
import {
    GraphQLSchema,
    valueFromASTUntyped,
    getNamedType,
    isListType,
    isNonNullType,
    isObjectType,
    isInterfaceType,
    type DirectiveNode,
    type FieldDefinitionNode,
    type ObjectTypeDefinitionNode,
    type ObjectTypeExtensionNode,
    type InterfaceTypeDefinitionNode,
    type InterfaceTypeExtensionNode,
    type GraphQLInputType,
} from "graphql";

type Config = {
    /** default: false */
    includeIntrospectionTypes?: boolean;
    /** default: true */
    sort?: boolean;
    /** default: ["AWSJSON","JSON"] */
    jsonScalarNames?: string[];
};

type OutArg = { name: string; value?: unknown };
type OutDirective = { name: string; arguments: OutArg[] };
type OutField = { name: string; directives: OutDirective[] };
type OutType = { name: string; directives: OutDirective[]; fields: OutField[] };

// --- helpers

const unwrapNamed = (t: GraphQLInputType): { named: string; isList: boolean } => {
    let cur: any = t;
    let isList = false;
    while (isNonNullType(cur)) cur = cur.ofType;
    while (isListType(cur)) {
        isList = true;
        cur = cur.ofType;
        while (isNonNullType(cur)) cur = cur.ofType;
    }
    const named = getNamedType(cur).name;
    return { named, isList };
};

const buildDirectiveArgTypeIndex = (schema: GraphQLSchema) => {
    // directiveName -> (argName -> namedTypeName)
    const idx = new Map<string, Map<string, string>>();
    for (const d of schema.getDirectives()) {
        const m = new Map<string, string>();
        for (const a of d.args) {
            m.set(a.name, unwrapNamed(a.type).named);
        }
        idx.set(d.name, m);
    }
    return idx;
};

const tryParseJson = (v: unknown) => {
    if (typeof v !== "string") return v;
    try {
        return JSON.parse(v);
    } catch {
        return v;
    }
};

const toOutDirective = (
    node: DirectiveNode,
    argTypeIndex: Map<string, Map<string, string>>,
    jsonScalarNames: Set<string>,
): OutDirective => {
    const name = node.name.value;
    const argNodes = node.arguments ?? [];
    if (!argNodes.length) return { name, arguments: [] };

    const typesForDir = argTypeIndex.get(name) ?? new Map<string, string>();

    // Coerce values with GraphQL util (handles lists/objects/enums/null)
    const raw: Record<string, unknown> = {};
    let hasJsonTypedArg = false;

    for (const a of argNodes) {
        const argName = a.name.value;
        const v = valueFromASTUntyped(a.value);
        const typeName = typesForDir.get(argName);
        if (typeName && jsonScalarNames.has(typeName)) hasJsonTypedArg = true;
        raw[argName] = typeName && jsonScalarNames.has(typeName) ? tryParseJson(v) : v;
    }

    // Keep your existing “packed JSON string” convention when any arg is JSON-typed
    if (hasJsonTypedArg) {
        return {
            name,
            arguments: [{ name: "value", value: JSON.stringify(raw) }],
        };
    }

    // Otherwise, emit standard args (small + useful)
    return {
        name,
        arguments: Object.entries(raw).map(([k, v]) => ({ name: k, value: v })),
    };
};

const mergeDirectives = (
    primary?: readonly DirectiveNode[] | null,
    extensions?: readonly (readonly DirectiveNode[] | null | undefined)[],
): DirectiveNode[] => {
    const out: DirectiveNode[] = [];
    if (primary?.length) out.push(...primary);
    if (extensions?.length) {
        for (const d of extensions) if (d?.length) out.push(...d);
    }
    return out;
};

const sortByName = <T extends { name: string }>(arr: T[]) =>
    [...arr].sort((a, b) => a.name.localeCompare(b.name));

// --- plugin

export const plugin: PluginFunction<Config> = (schema, _docs, config) => {
    const includeIntrospectionTypes = config.includeIntrospectionTypes ?? false;
    const doSort = config.sort ?? true;
    const jsonScalarNames = new Set(config.jsonScalarNames ?? ["AWSJSON", "JSON"]);

    const argTypeIndex = buildDirectiveArgTypeIndex(schema);

    const out: OutType[] = [];

    for (const [typeName, gqlType] of Object.entries(schema.getTypeMap())) {
        if (!includeIntrospectionTypes && typeName.startsWith("__")) continue;

        if (!(isObjectType(gqlType) || isInterfaceType(gqlType))) continue;

        const astNode = (gqlType as any).astNode as
            | ObjectTypeDefinitionNode
            | InterfaceTypeDefinitionNode
            | undefined;
        const extNodes = ((gqlType as any).extensionASTNodes ?? []) as
            | (ObjectTypeExtensionNode | InterfaceTypeExtensionNode)[]
            | undefined;

        if (!astNode) continue;

        // Type directives: ast + extensions
        const typeDirectives = mergeDirectives(
            astNode.directives,
            extNodes?.map((e) => e.directives),
        ).map((d) => toOutDirective(d, argTypeIndex, jsonScalarNames));

        // Fields: merge by field name across ast + extensions (preserve empties)
        const fieldMap = new Map<string, DirectiveNode[]>();

        const addField = (f: FieldDefinitionNode) => {
            const n = f.name.value;
            const existing = fieldMap.get(n) ?? [];
            const merged = existing.concat(f.directives ?? []);
            fieldMap.set(n, merged);
        };

        for (const f of astNode.fields ?? []) addField(f);
        for (const e of extNodes ?? []) for (const f of e.fields ?? []) addField(f);

        const fields: OutField[] = [];
        for (const [fname, dirs] of fieldMap.entries()) {
            fields.push({
                name: fname,
                directives: (dirs ?? []).map((d) => toOutDirective(d, argTypeIndex, jsonScalarNames)),
            });
        }

        out.push({ name: typeName, directives: typeDirectives, fields });
    }

    const finalOut = doSort
        ? sortByName(out).map((t) => ({
            ...t,
            directives: sortByName(t.directives),
            fields: sortByName(t.fields).map((f) => ({ ...f, directives: sortByName(f.directives) })),
        }))
        : out;

    return JSON.stringify(finalOut, null, 4) + "\n";
};

export default plugin;