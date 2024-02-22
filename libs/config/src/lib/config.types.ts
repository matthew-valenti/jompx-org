export interface OrgConfiguration {
    org: Configuration;
}

export interface Configuration {
    organization: Organization;
    emails: Email[];
    phones: Phone[];
    domains: Domain[];
    apps: App[];
    environments: Environment[];
    deployment: Deployment;
    clientVpns: ClientVpn[];
}

export interface Organization {
    id: string;
    name: string;
}

export interface Email {
    email: string;
    tags: string[];
}

export interface Phone {
    phone: string;
    tags: string[];
}

export interface Domain {
    rootDomainName: string;
}

export interface Environment {
    accountId: string;
    region: string;
    name: string;
    cidrBlock?: string;
}

export interface App {
    name: string;
    rootDomainName: string;
}

export type DeploymentStage = 'prod' | 'test';

export interface Deployment {
    branches: DeploymentBranch[];
}

export interface DeploymentBranch {
    name: string;
    pipelines: Pipeline[];
}

export type Pipeline = 'cdk' | 'apps';

export interface ClientVpn {
    name: string;
    samlProviderName: string;
    cidr: string;
    dnsServers: string[];
}

// export interface ILocalConfig {
//     [key: string]: {
//         stage?: string;
//         // stages?: IStage; // TODO: Do we need the ability to override stages on local? What about putting the stage in the CLI deploy instead?
//     };
// }

/*
appSync: {
    graphqlUrlSsmParameterName: string; // Problem. How do we make calling AppSync efficient from business classes.
};
*/