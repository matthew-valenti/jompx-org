import { ILocalConfig } from '@jompx/constructs';

export const Local: ILocalConfig = {
    '@jompx-local': {
        stage: 'sandbox1', // sandbox1, test, prod, management
        // stages: {
        //     sandbox1: {
        //         environments: [
        //             {
        //                 type: 'cicd',
        //                 name: 'cicd-test'
        //             },
        //             {
        //                 type: 'common',
        //                 name: 'common-test'
        //             },
        //             {
        //                 type: 'main',
        //                 name: 'sandbox1'
        //             }
        //         ]
        //     }
        // }
    }
}
