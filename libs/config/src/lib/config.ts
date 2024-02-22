import * as cdk from 'aws-cdk-lib';
import * as changeCase from 'change-case';
import { Node } from 'constructs';
import * as ltype from './config.types';
import { execSync } from 'child_process';

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

    public get organizationNamePascalCase(): string {
        return changeCase.pascalCase(this.value.organization.name);
    }

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
     * Get deployment stage.
     */
    public get deploymentStage(): ltype.DeploymentStage {
        return this.appNode.tryGetContext('stage') ?? 'prod';
    }

    /**
     * Get an AWS environment by friendly name.
     * @param name
     * @returns
     */
    public environmentByName(name: string): ltype.Environment | undefined {
        return this.value.environments.find((o: ltype.Environment) => o.name === name);
    }

    /**
     * Get an AWS environment by AWS account id.
     * @param accountId
     * @returns
     */
    public environmentByEnv(env: cdk.Environment | undefined): ltype.Environment | undefined {
        return this.value.environments.find((o: ltype.Environment) => o.accountId === env?.account && o.region === env?.region);
    }

    /**
     * Given a list of tags, return a list of email addresses that have at least one matching tag.
     * @returns
     */
    public emailsByTag(tag: string | string[]): string[] | undefined {
        const emails = this.value.emails as ltype.Email[];
        const tags = Array.isArray(tag) ? tag : [tag];
        return emails.filter(email => tags.some(tag => email.tags.includes(tag))).map(email => email.email);
    }

    /**
     * Given a list of tags, return a list of phone numnbers that have at least one matching tag.
     * @returns
     */
    public phonesByTag(tag: string | string[]): string[] | undefined {
        const phones = this.value.phones as ltype.Phone[];
        const tags = Array.isArray(tag) ? tag : [tag];
        return phones.filter(phone => tags.some(tag => phone.tags.includes(tag))).map(phone => phone.phone);
    }

    /**
     * Get a distinct/unique list of root domain names across all apps.
     * @returns
     */
    public get appRootDomainNames(): string[] | undefined {
        return [...new Set(this.value.apps.map(o => o.rootDomainName))];
    }

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

    public environmentById(accountId: string | undefined): ltype.Environment | undefined {
        let rv = undefined;

        const environment = this.value.environments.find((o: ltype.Environment) => o.accountId === accountId);
        if (!environment) throw Error(`Environment account id not found! Add environment to config.ts.`);
        rv = environment;

        return rv;
    }

    /**
     * Get branch from CDK context or from current Git branch.
     * The CDK deployment pipeline must run in the context of a branch.
     * Error if branch is not specified.
     */
    public get branch(): string {
        let branch: string = this.appNode.tryGetContext('branch');
        if (!branch) {
            try {
                const stdout: Buffer = execSync('git symbolic-ref --short HEAD');
                branch = stdout.toString().trim();
            } catch (error) {
                // Swallow error. Throw error on blank branch instead.
            }
        }

        if (!branch) {
            throw ('Jompx.AppSyncDatasource: File schema.graphql.directives.json is empty or missing. Check that this file exists in the Lambda layer?');
        }

        return branch;
    }
}