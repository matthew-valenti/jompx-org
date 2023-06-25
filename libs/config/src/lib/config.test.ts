import * as cdk from 'aws-cdk-lib';
import { Config } from './config';
import { Config as OrgConfig } from '@root/config';
import { Local as LocalConfig } from '@root/config.local';

/**
 * npx jest config.test.ts
 */

let config: Config;

beforeAll(async () => {
    const app = new cdk.App({ context: { ...OrgConfig, ...LocalConfig } });
    new cdk.Stack(app);
    config = new Config(app.node);
});

describe('Config', () => {

    test('environments', () => {
        const environments = config.value.environments;
        expect(environments).toHaveLength(5);
    });

    test('environmentByName', () => {
        const environment = config.environmentByName('prod');
        expect(environment).toEqual(
            expect.objectContaining({
                accountId: '281660020318',
                region: 'us-west-2',
                name: 'prod'
            })
        );
    });

    test('environmentByAccountId', () => {
        const environment = config.environmentByEnv({account: '281660020318', region: 'us-west-2'});
        expect(environment).toEqual(
            expect.objectContaining({
                accountId: '281660020318',
                region: 'us-west-2',
                name: 'prod'
            })
        );
    });

    test('emails by tag', () => {
        let emails = config.emailsByTag('billing');
        expect(emails).toEqual(['admin@jompx.com'])
        emails = config.emailsByTag(['billing']);
        expect(emails).toEqual(['admin@jompx.com'])
    });

    test('domains', () => {
        const domains = config.value.domains;
        expect(domains).toHaveLength(1);
    });

    test('apps', () => {
        const apps = config.apps();
        expect(apps).toHaveLength(2);
    });

    test('appRootDomainNames', () => {
        const appRootDomainNames = config.appRootDomainNames;
        expect(appRootDomainNames).toContain('jompx.com');
    });

    test('env', () => {
        const env = config.env('app');
        expect(env).toEqual(
            expect.objectContaining({
                account: '281660020318',
                region: 'us-west-2'
            })
        );
    });

    test('organizationName', () => {
        const organizationName = config.value.organization.name;
        expect(organizationName).toBe('my-org');
    });

    test('organizationNamePascalCase', () => {
        const organizationName = config.organizationNamePascalCase;
        expect(organizationName).toBe('MyOrg');
    });
});
