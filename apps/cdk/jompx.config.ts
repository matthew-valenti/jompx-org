import { IConfig } from '@jompx/constructs';

export const Config: IConfig = {
    '@jompx': {
        organizationName: 'jompx', // Lower case (use dashes if needed). Used to uniquely name resources e.g. S3 bucket name.
        apps: [
            {
                name: 'admin',
                rootDomainName: 'jompx.com'
            }
        ],
        // An environment is the target AWS account and region into which a stack will be deployed.
        environments: [
            {
                accountId: '863054937555',
                region: 'us-west-2',
                name: 'cicd-test'
            },
            {
                accountId: '896371249616',
                region: 'us-west-2',
                name: 'cicd-prod'
            },
            {
                accountId: '281660020318',
                region: 'us-west-2',
                name: 'prod'
            },
            {
                accountId: '706457422044',
                region: 'us-west-2',
                name: 'test'
            },
            {
                accountId: '066209653567',
                region: 'us-west-2',
                name: 'sandbox1'
            }
        ],
        stages: {
            // In prod stage, when main branch is updated, a set of deployment types wlil be deployed to environments.
            prod: {
                branch: 'main',
                deployments: [
                    {
                        type: 'cicd',
                        environmentName: 'cicd-prod',
                    },
                    {
                        type: 'common',
                        environmentName: 'common-prod'
                    },
                    {
                        type: 'dns',
                        environmentName: 'prod'
                    },
                    {
                        type: 'app',
                        environmentName: 'prod'
                    }
                ]
            },
            test: {
                branch: 'test',
                deployments: [
                    {
                        type: 'cicd',
                        environmentName: 'cicd-test'
                    },
                    {
                        type: 'common',
                        environmentName: 'common-test'
                    },
                    {
                        type: 'dns',
                        environmentName: 'test'
                    },
                    {
                        type: 'app',
                        environmentName: 'test'
                    }
                ]
            },
            sandbox1: {
                branch: '(sandbox1)',
                deployments: [
                    {
                        type: 'cicd',
                        environmentName: 'cicd-test'
                    },
                    {
                        type: 'common',
                        environmentName: 'common-test'
                    },
                    {
                        type: 'app',
                        environmentName: 'sandbox1'
                    }
                ]
            }
        }
    }
}
