// https://www.npmjs.com/package/aws-parameter-cache
// https://www.npmjs.com/package/@puresec/function-shield
// https://github.com/middyjs/middy

import get = require('get-value');
// import { ssmParameter } from 'aws-parameter-cache'; TODO: Do we want to use this?
import * as jompx from '@jompx/constructs';
import { Post } from './post';

// const param = ssmParameter({ name: 'foo' });

exports.handler = async (event: jompx.IAppSyncResolverEvent) => {
    console.log('event', event);
    console.log('process', process);
    
    let data = null;

    const post = new Post();

    switch(event?.stash?.operation) {
        default:
            data = await callMethodFromEvent<Post>(post, event);
            // data = await jompx.AppSyncResolver.callMethodFromEvent<Post>(post, event); // TODO: Important - why does this cause the Lambda to time-out? I think '@jompx/constructs' needs to be published.
            // Might need to implement this as layers: https://stackoverflow.com/questions/60533785/how-do-i-get-relative-package-json-dependencies-to-work-with-awss-sam-build-com
    }

    console.log('post.construct.handler.ts', data);
    return data;
};

// Temporary copy of: src\app-sync\app-sync-resolver.ts
// Delete this copy when Lambda time-out issue resolved.
function callMethodFromEvent<T>(classInstance: any, event: any): any {

    // Get event arguments from event as an array of values (required for Reflect method below).
    const eventArguments: any[] = event?.arguments ? Object.values(event.arguments) : [];

    // Organize cognito specific variables.
    const cognito = {
        sub: event?.identity?.claims?.sub,
        email: event?.identity?.claims?.email,
        groups: event?.identity?.groups,
        authorization: event?.request?.headers?.authorization
    };

    // We must at least pass the event. Methods might need any type of event information.
    // Break out Cognito properties (if Cognito auth) for convenience only.
    // We must Cognito authorization to any methods that want to call GraphQL with the calling user Cognito permissions.
    const props: jompx.AppSyncMethodProps = {
        ...(cognito?.sub && { cognito }),
        event
    };

    eventArguments.push(props);
    return Reflect.apply(classInstance[event.stash.operation as keyof T], undefined, eventArguments);
}
