import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as changeCase from 'change-case';
import * as jompx from '@jompx/constructs';
import { Config } from '@jompx-org/config';

export class CommunicationStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const config = new Config(this.node);
        
        const environment = config.environmentByEnv(props?.env);
        if (!environment) return;

        // Create SES verified domain entities for all domains.
        config.value.domains?.forEach(domain => {
            const domainName = environment.name === 'prod' ? domain.rootDomainName : `${environment.name}.${domain.rootDomainName}`;
            new jompx.SesDomainEntity(this, `SesDomainEntity${changeCase.pascalCase(environment.name)}`, {
                domainName
            });
        });
    }
}
