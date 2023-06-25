import * as cdk from 'aws-cdk-lib';
import * as changeCase from 'change-case';
import { Node } from 'constructs';
import * as ltype from './config.types';

export class Config {

    constructor(
        public appNode: Node
    ) { }

    /**
     * Allow config values to be accessed directly with intellisense and type safety.
     * 
     * @returns 
     */
    public get value(): ltype.Configuration {
        return this.appNode.tryGetContext('org');
    }

    // public get organizationId(): string {
    //     return this.appNode.tryGetContext('@jompx').organization.id;
    // }

    // public get organizationName(): string {
    //     return this.appNode.tryGetContext('@jompx').organization.name;
    // }

    public get organizationNamePascalCase(): string {
        return changeCase.pascalCase(this.value.organization.name);
    }

    /**
     * Get stage from command line or config. e.g. sandbox1, test, prod.
     * @returns
     */
    // public get stage(): string {
    //     const stage = this.appNode.tryGetContext('stage') ?? this.appNode.tryGetContext('@jompx-local').stage;
    //     if (!stage) throw Error('Jompx: Stage not found! Stage is missing from command line or jompx.local.ts.');
    //     return stage;
    // }

    // public get account(): string {
    //     const account = this.appNode.tryGetContext('account')
    //     return account;
    // }

    /**
     * Get unique list of accountIds from environments.
     */
    public get accountIds(): string[] {
        return [...new Set(this.value.environments?.map(environment => environment.accountId))];
    }

    /**
     * Get unique list of regions from environments.
     */
    public get regions(): string[] {
        return [...new Set(this.value.environments?.map(environment => environment.region))];
    }

    /**
     * Get list of AWS environemnts. An AWS environment is primarily a accountId/region pair.
     * @returns
     */
    // public get environments(): ltype.IEnvironment[] | undefined {
    //     return this.appNode.tryGetContext('@jompx').environments;
    // }

    /**
     * Get an AWS environment by friendly name.
     * @param name
     * @returns
     */
    public environmentByName(name: string): ltype.IEnvironment | undefined {
        return this.value.environments.find((o: ltype.IEnvironment) => o.name === name);
    }

    /**
     * Get an AWS environment by AWS account id.
     * @param accountId
     * @returns
     */
    public environmentByEnv(env: cdk.Environment | undefined): ltype.IEnvironment | undefined {
        return this.value.environments.find((o: ltype.IEnvironment) => o.accountId === env?.account && o.region === env?.region);
    }

    /**
     * Given a list of tags, return a list of email addresses that have at least one matching tag.
     * @returns
     */
        public emailsByTag(tag: string | string[]): string[] | undefined {
            const emails = this.value.emails as ltype.Email[];
            const tags = Array.isArray(tag) ? tag: [tag];
            return emails.filter(email => tags.some(tag => email.tags.includes(tag)) ).map(email => email.email);
        }

    /**
     * Get list of domains. A domain drives the communication layer e.g. SES domain identity.
     * @returns
     */
    // public get domains(): ltype.IApp[] | undefined {
    //     return this.appNode.tryGetContext('@jompx').domains;
    // }

    /**
     * Get list of apps. An app is typically deployed across all stages and is acceccable on each stage.
     * @returns
     */
    // public get apps(): ltype.IApp[] | undefined {
    //     return this.appNode.tryGetContext('@jompx').apps;
    // }

    /**
     * Get a distinct/unique list of root domain names across all apps.
     * @returns
     */
    public get appRootDomainNames(): string[] | undefined {
        return [...new Set(this.value.apps.map(o => o.rootDomainName))];
    }

    /**
     * Get config stages.
     * @returns
     */
    // public get stages(): Map<string, ltype.IStageProperties> {
    //     const configStages: ltype.IStage = this.appNode.tryGetContext('@jompx').stages;
    //     const localStages: ltype.IStage = this.appNode.tryGetContext('@jompx-local').stages;

    //     // Get stages from config and local config. Local config overrides config.
    //     const stages = { ...configStages, ...localStages };

    //     // TODO: Remove. I don't think we want to try to join an account to a stage.
    //     // // For each stage environment join to account environment (and set account).
    //     // const map = new Map(Object.entries(stages));
    //     // for (const value of map.values()) {
    //     //     value.environments.forEach(environment => {
    //     //         environment.account = this.environmentByName(environment.name);
    //     //     });
    //     // }

    //     // return stages;
    //     return new Map(Object.entries(stages));
    // }

    // stageEnvironments
    // public stageDeployments(stageName: string): ltype.IStageDeployment[] | undefined {
    //     let rv = undefined;
    //     const stages = this.stages;

    //     if (stages) {
    //         rv = stages.get(stageName)?.deployments;
    //     }

    //     return rv;
    // }

    /**
     * OLD: Before simplification.
     * Get env (AWS accountId + region) from config (type + stage) e.g. cicd + test = xxxxxxxxxxxx + us-west-2.
     * If no stage provided then will use current stage.
     * @param deploymentType
     * @param stage
     * @returns
     */
    // public env(deploymentType: string, stage?: string): cdk.Environment | undefined {
    //     let rv = undefined;

    //     const stageDeployments = this.stageDeployments(stage ?? this.stage());
    //     const environmentName = stageDeployments?.find(o => o.type === deploymentType)?.environmentName;

    //     if (environmentName) {
    //         const environment = this.environmentByName(environmentName);
    //         rv = { account: environment?.accountId, region: environment?.region };
    //     }

    //     return rv;
    // }

    /**
     * Get env (AWS accountId + region) from environmentName e.g. prod = xxxxxxxxxxxx + us-west-2.
     * @param name
     * @returns
     */
    public env(environmentName: string): cdk.Environment | undefined {
        let rv = undefined;

        const environment = this.environmentByName(environmentName);
        if (!environment) throw Error(`Environment name not found! Add environment ${environmentName} to config.ts.`);
        rv = { account: environment?.accountId, region: environment?.region };

        return rv;
    }

    public environmentById (accountId: string | undefined): ltype.IEnvironment | undefined {
        let rv = undefined;

        const environment = this.value.environments.find((o: ltype.IEnvironment) => o.accountId === accountId);
        if (!environment) throw Error(`Environment account id not found! Add environment to config.ts.`);
        rv = environment;

        return rv;
    }
}