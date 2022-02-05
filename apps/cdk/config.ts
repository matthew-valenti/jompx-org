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
        accounts: [
            {
                accountId: '863054937555',
                accountName: 'cicd-test',
                bootstrap: true
            }
        ]
    }
}