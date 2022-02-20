// TODO: Type the config file when it is closer to final.
import { IConfig } from '@jompx/constructs';

export const Config: IConfig = {
    '@jompx': {
        organizationName: 'jompx', // Used to uniquely name resources e.g. S3 bucket name.
        gitHub: {
            repo: 'matthew-valenti/jompx-org'
        },
        // An environment is the target AWS account and region into which a stack will be deployed.
        environments: [
            {
                accountId: 'abc123',
                region: 'us-west-2',
                environmentName: 'prod',
                stage: 'prod'
            },
            {
                accountId: 'def456',
                region: 'us-west-2',
                environmentName: 'test',
                stage: 'test'
            },
            {
                accountId: '863054937555',
                region: 'us-west-2',
                environmentName: 'cicd-test',
                stage: 'test'
            },
            {
                accountId: '896371249616',
                region: 'us-west-2',
                environmentName: 'cicd-prod',
                stage: 'prod'
            },
            {
                accountId: '066209653567',
                region: 'us-west-2',
                environmentName: 'sandbox1',
                stage: 'sandbox'
            }
        ]
    }
};
