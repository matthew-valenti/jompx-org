import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as changeCase from 'change-case';
import * as jompx from '@jompx/constructs';

export class CommunicationStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const config = new jompx.Config(this.node);
        const stage = config.stage;
        const environment = config.environmentByEnv(props?.env);

        // Create SES verified domain entities for all domains.
        if (environment?.name) {
            config.domains?.forEach(domain => {
                const domainName = stage === 'prod' ? domain.rootDomainName : `${environment.name}.${domain.rootDomainName}`;
                new jompx.SesDomainEntity(this, `SesDomainEntity${changeCase.pascalCase(environment.name)}`, {
                    domainName
                });
            });
        }
    }
}
