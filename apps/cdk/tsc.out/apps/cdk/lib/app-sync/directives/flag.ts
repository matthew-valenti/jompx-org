import { Directive } from '@aws-cdk/aws-appsync-alpha';
import { CustomDirective } from '@jompx/constructs';

// 0. Directive name (camelCase).
const directiveName = 'flag';

// 1. Directive value type.
export interface FlagDirectiveValue {
    name: string;
}

// 2. Set value (use this function in GraphQL schema). Make the param simple and intuitive.
export function flag(name: string): Directive {
    // 3. Set value.
    return Directive.custom(`@${directiveName}(value: "${CustomDirective.encodeArguments({ name })}")`);
}

export default class FlagDirective extends CustomDirective {

     // 4. GraphQL schema definition. Change the @name and on properties accordingly.
    public definition(): string {
        return `directive @${directiveName}(value: AWSJSON) on FIELD_DEFINITION | OBJECT`;
    }

    // 5. Get typed value.
    public value(directives?: Directive[]): FlagDirectiveValue | undefined {
        return undefined; // FlagDirective.getValue<FlagDirectiveValue>(directiveName, directives);
    }
}


// import { Directive } from '@aws-cdk/aws-appsync-alpha';
// import { CustomDirective } from '@jompx/constructs';

// // 0. Directive name (camelCase).
// const directiveName = 'flag';

// // 1. Directive value type.
// export interface FlagDirectiveValue {
//     name: string;
// }

// // 2. Set value (use this function in GraphQL schema). Make the param simple and intuitive.
// export function flag(name: string): Directive {
//     // 3. Set value.
//     return Directive.custom(`@${directiveName}(value: "${CustomDirective.encodeArguments({ name })}")`);
// }

// export class FlagDirective extends CustomDirective {

//      // 4. GraphQL schema definition. Change the @name and on properties accordingly.
//     public definition(): string {
//         return `directive @${directiveName}(value: AWSJSON) on FIELD_DEFINITION | OBJECT`;
//     }

//     // 5. Get typed value.
//     public value(directives?: Directive[]): FlagDirectiveValue | undefined {
//         return this.getValue<FlagDirectiveValue>(directiveName, directives);
//     }
// }

/*
https://javascript.plainenglish.io/how-to-build-a-plugin-system-with-typescript-e7efb9f7e1ab

Ideally we wouldn't export a type. The type would be intersection type would be created simply from the value return type.
https://stackoverflow.com/questions/58612535/intersection-types-from-variable-array-of-types
https://www.typescriptlang.org/play?ssl=19&ssc=5&pln=19&pc=24#code/C4TwDgpgBAgmCWBRAHsCA7AzvA9uqAvFAN5QDaA1hCAFxSbABO86A5gLp0CG6IUAvgCgIyMDkbAooSFAAKAGwCurFoSgAKFgx4BjCHQAqEBgEpCAPlgIUaLLnQBuQdOgBhPA0aKdwcQB4DSyJ0CAB3DQA6KK5GVkxuXjJ2MwJLAydncGgYXgAxRXQfezV1KIiYuISQFMseEAyXKABVdHsDHABJdDRGTAgivD8W+yDBKA1hvCgRWwATTCg6sfGoAH4NCsUAWwxgOkn0GqgANxx4WeXxuhDjiEZlsxmMeY3Y7d26FgAzO6gunr6A0OFhOZwuKxW63+d0BwHsy2uEFujAaWSgACUIMBFIx0AFRuMDNNUM8FjkQPlCnC8Mt1pjsbiDFl8QioESnugXuTKUCkrTmq08O1ob1+tS8fScegmZAAmR0NsAEZ3djmcyXFaI5GCQQ6eRcTALIwMEjLbRwnRQMBKFRYOgKZQsJJqJJOcbm+CW62OvHskmchYO21QAA+chtTtV6m9tsMZmIGp0HkkOhxjF2Qa0amAAAt4JgIjGtBkIXqDQsAHJhY2SDkvXP500Q93ALgWq0RrBqVOMdPdTNYCJJwpt6OdkxulZCDXwL4aGC9rggCL5heMJdjn0meMa8aNGwYbBTIgHYXdGFi+x+SW4-Hq5tQdMM-BV0I1xYLFw4Oev98AMigdwsCYbxfEYPwDzsPBzAccYNWnCF939I98CIG9fXvFYnylKBf2MSQDSkLJv1w6t8KgACgM8UD-EglCYOWBCoGHaifHEdQdwhAB6LjFjAa0+CLLANR4qAc2AYAwHiHjtB0CgcGRL55BwUIhxwLYuK4LiAEYADYAGYABYAFZtIAdgAJkTZNmP1Q0qJAtjGGzPMCxYxywI-IjIBImtJ3GMt7OTLwnMLTsCy+cREC4HQc03YNUibZsAHlFQAKzFcpDXgVh0HUBtMAAGg7H18tc7d4InRjBGndyoFyHAcAHEo0AYQx8JMOhSEinAOLoAByHr+oEEEEwCjwcHkCAImU1h1H6oTpmOLglFa-qTB1cZsNxJLxh6ugOJBQbGv66qhDqgAhGJmqIfL8Pa0wuqgRUYj6qB+pexhhv4UblhYybptm+bFqRFbFDWjblm2-AxpWT6DqOD6YlO8YhFqmyGpwd8iBrMLSsxgcNrqnrsagEJwkxmsOMEEn8IiHrqd1DHGquxhSdxoT1DIAnO2K1mB2SJngKgHrWdJ8n6pZmIqY20XpbphnZaltm6c+jigA

Dynamic modules
https://www.typescriptlang.org/docs/handbook/modules.html

Good advanced types tutorial:
https://levelup.gitconnected.com/typescript-advanced-types-this-type-and-dynamic-types-ecb99c4ec275
*/