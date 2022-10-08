import * as graphql from 'graphql';
import { Directive } from '@aws-cdk/aws-appsync-alpha';
import { CustomDirective } from '@jompx/constructs';

const directiveName = 'tag';

interface TagDirectiveValue {
    name: string;
}

export function tag(name: string): Directive {
    const value = { name };
    return CustomDirective.getDecorator(directiveName, value);
}

export class TagDirective extends CustomDirective {

    public definition(): string {
        return TagDirective.getDefinition(directiveName, [
            graphql.DirectiveLocation.FIELD_DEFINITION,
            graphql.DirectiveLocation.OBJECT
        ]);
    }

    public value(directives: any): TagDirectiveValue | undefined {
        return TagDirective.getValue<TagDirectiveValue>(directiveName, directives);
    }
}