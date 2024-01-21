// export const Config = {
//     '@organization': {
//         "matthew": "hello"
//     }
// }


import { OrgConfiguration } from '@jompx-org/config';

export const Config: OrgConfiguration = {
    'org': {
        organization: {
            name: 'jompx', // Lower case (use dashes if needed). Used to uniquely name resources e.g. S3 bucket name. Use a short name or acronym.
            id: 'o-v24jtne9gy'
        },
        emails: [
            {
                email: 'admin@jompx.com',
                tags: ['billing', 'security', 'errors']
            }
        ],
        // TODO: Used by communication stack only for SES. Does this need to be a Jompx config?
        domains: [
            {
                rootDomainName: 'jompx.com'
            }
        ],
        apps: [
            {
                name: 'admin',
                rootDomainName: 'jompx.com'
            }
        ],
        // An environment is the target AWS account and region into which a stack will be deployed.
        environments: [
            {
                accountId: '015117255009',
                region: 'us-west-2',
                name: 'management',
                cidr: '10.0.0.0'
            },
            {
                accountId: '863054937555',
                region: 'us-west-2',
                name: 'cicd-test',
                cidr: '10.1.0.0'
            },
            {
                accountId: '896371249616',
                region: 'us-west-2',
                name: 'cicd-prod',
                cidr: '10.2.0.0'
            },
            {
                accountId: '767397869266',
                region: 'us-west-2',
                name: 'network',
                cidr: '10.3.0.0'
            },
            {
                accountId: '992382594865',
                region: 'us-west-2',
                name: 'security',
                cidr: '10.4.0.0'
            },
            {
                accountId: '281660020318',
                region: 'us-west-2',
                name: 'prod',
                cidr: '10.5.0.0'
            },
            {
                accountId: '706457422044',
                region: 'us-west-2',
                name: 'test',
                cidr: '10.6.0.0'
            },
            {
                accountId: '058264302432',
                region: 'shared-services-dev',
                name: 'test',
                cidr: '10.7.0.0'
            },
            {
                accountId: '066209653567',
                region: 'us-west-2',
                name: 'sandbox1',
                cidr: '10.255.0.0' // Start sandbox CIDR range from end of range.
            }
        ],
        deployment: {
            defaultStage: 'prod',
            branches: [
                { name: 'main', pipelines: ['cdk', 'apps'] },
                { name: 'test', pipelines: ['cdk', 'apps'] },
                { name: '(sandbox1)', pipelines: ['cdk', 'apps'] }
            ]
        }
    }
}

