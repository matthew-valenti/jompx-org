// https://www.npmjs.com/package/aws-parameter-cache
// https://www.npmjs.com/package/@puresec/function-shield
// https://github.com/middyjs/middy

import * as jompx from '@jompx/constructs';
// import { ssmParameter } from 'aws-parameter-cache'; TODO: Do we want to use this?
import { Post } from './post';

// const param = ssmParameter({ name: 'foo' });

exports.handler = async (event: jompx.IAppSyncResolverEvent) => {
    console.log('event', event);
    console.log('process', process);
    
    let data = null;

    const post = new Post();

    switch(event?.stash?.operation) {
        default:
            data = await jompx.AppSyncResolver.callMethodFromEvent<Post>(post, event);
    }

    data = {
        output: data
    }

    console.log('post-schema.construct.handler.ts', data);
    return data;
};
