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
        phones: [],
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
                cidrBlock: '10.0.0.0'
            },
            {
                accountId: '767397869266',
                region: 'us-west-2',
                name: 'network',
                cidrBlock: '10.1.0.0'
                // Reserve 10.2.0.0 thru 10.10.0.0 for additional network related services e.g. client VPN.
            },
            {
                accountId: '863054937555',
                region: 'us-west-2',
                name: 'cicd-test',
                cidrBlock: '10.11.0.0'
            },
            {
                accountId: '896371249616',
                region: 'us-west-2',
                name: 'cicd-prod',
                cidrBlock: '10.12.0.0'
            },
            
            {
                accountId: '992382594865',
                region: 'us-west-2',
                name: 'security',
                cidrBlock: '10.15.0.0'
            },
            {
                accountId: '281660020318',
                region: 'us-west-2',
                name: 'prod',
                cidrBlock: '10.16.0.0'
            },
            {
                accountId: '706457422044',
                region: 'us-west-2',
                name: 'test',
                cidrBlock: '10.17.0.0'
            },
            {
                accountId: '058264302432',
                region: 'shared-services-dev',
                name: 'test',
                cidrBlock: '10.18.0.0'
            },
            {
                accountId: '066209653567',
                region: 'us-west-2',
                name: 'sandbox1',
                cidrBlock: '10.255.0.0' // Start sandbox CIDR range from end of range.
            }
        ],
        deployment: {
            branches: [
                { name: 'main', pipelines: ['cdk', 'apps'] },
                { name: 'test', pipelines: ['cdk', 'apps'] },
                { name: '(sandbox1)', pipelines: ['cdk', 'apps'] }
            ]
        },
        clientVpns: [{
            // Unique vpn name vpn-<region>-<group/purpose>.
            name: 'vpn-us-west-2-developer',
            // Management account > IAM > Identity providers > AWS_SSO_For_Client_VPN.
            samlProviderName: 'AWS_SSO_For_Client_VPN',
            // Start service CIDR blocks at 50. Do not clutter the AWS account CIDR blocks.
            // It's highly unlikely we would need 50 core AWS accounts.
            cidr: '10.2.0.0/16',
            // If not provided, will be set to the default DNS server for a VPC provided by AWS.
            // It is the base of the VPC network range plus two. e.g. 10.3.0.2 for the network account.
            dnsServers: []
        }],
    }
}

