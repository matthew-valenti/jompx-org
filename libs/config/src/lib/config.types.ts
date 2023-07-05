export interface OrgConfiguration {
    org: Configuration;
}

export interface Configuration {
    organization: Organization;
    emails: Email[];
    domains: Domain[];
    environments: IEnvironment[];
    deployment: Deployment;
    apps: IApp[];
}

export interface Organization {
    id: string;
    name: string;
}

export interface Email {
    email: string;
    tags: string[];
}

export interface Domain {
    rootDomainName: string;
}

export interface IEnvironment {
    accountId: string;
    region: string;
    name: string;
    cidr?: string;
}

export interface IApp {
    name: string;
    rootDomainName: string;
}

export type DeploymentStage = 'prod' | 'test';

export interface Deployment {
    defaultStage: DeploymentStage;
    branches: DeploymentBranch[];
}

export interface DeploymentBranch {
    name: string;
    pipelines: Pipeline[];
}

export type Pipeline = 'cdk' | 'apps';

export interface IStage {
    [key: string]: IStageProperties;
}

export interface IStageProperties {
    branch: string;
    deployments: IStageDeployment[];
}

export interface IStageDeployment {
    type: string;
    environmentName: string;
}

export interface IEnv {
    account: string;
    region: string;
}

export interface ILocalConfig {
    [key: string]: {
        stage?: string;
        // stages?: IStage; // TODO: Do we need the ability to override stages on local? What about putting the stage in the CLI deploy instead?
    };
}

/*
appSync: {
    graphqlUrlSsmParameterName: string; // Problem. How do we make calling AppSync efficient from business classes.
};
*/