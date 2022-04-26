// https://www.npmjs.com/package/aws-parameter-cache
// https://www.npmjs.com/package/@puresec/function-shield
// https://github.com/middyjs/middy

import * as jompx from '@jompx/constructs';
import { ssmParameter } from 'aws-parameter-cache';
import { Post } from './post';

const param = ssmParameter({ name: 'name' });

exports.handler = async (event: jompx.IAppSyncResolverEvent) => {
    console.log('event', event);
    let data = null;

    const post = new Post();

    switch(event?.stash?.operation) {
        default:
            data = jompx.AppSyncResolver.callMethodFromEvent<Post>(post, event);
    }

    data = {
        output: data
    }

    return data;
};
