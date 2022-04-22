import * as jompx from '@jompx/constructs';
import { Post } from './post';

exports.handler = async (event: jompx.IAppSyncResolverEvent) => {
    console.log('event', event);
    let data = null;

    const post = new Post();

    switch(event?.stash?.operation) {
        default:
            data = jompx.AppSyncResolver.CallMethodFromEvent<Post>(post, event);
    }

    data = {
        output: data
    }

    return data;
};
