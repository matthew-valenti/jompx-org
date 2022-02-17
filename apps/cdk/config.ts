export default {
    '@app': {
        deploy: {
            TestStack: {
                stage: {
                    test: 'cicd-test',
                    prod: 'cicd-prod'
                }
            }
        },
        stacks: {
            TestStack: {
                test: {
                    env: {
                        accountName: 'cicd-test',
                        region: ''
                    }
                },
                prod: {
                    env: {
                        accountName: 'cicd-prod',
                        region: ''
                    }
                }
            }
        },
        environments: [ // An environment is the target AWS account and region into which the stack is intended to be deployed.
            {
                accountId: '863054937555',
                region: 'us-west-2',
                environmentName: 'cicd-test',
                stage: 'test',
                bootstrap: true
            },
            {
                accountId: '!!!896371249616!!!',
                accountName: 'cicd-prod',
                stage: 'prod',
                bootstrap: true
            },
            {
                accountId: '066209653567',
                accountName: 'cicd-prod',
                stage: 'prod',
                bootstrap: true
            }
        ]
    }
}