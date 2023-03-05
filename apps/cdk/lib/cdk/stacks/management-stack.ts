import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as changeCase from 'change-case';
import * as jompx from '@jompx/constructs';

/*
Management account only. Restricted access. To be deployed manually to the AWS management account only.
Stack does NOT have a stage. There is not "test" management account. AWS only allows one manager/master account (that manages all other accounts).
It is best practice NOT to deploy resources to the managmeent account. However, we do need some bare essentials e.g. billing alarm.
*/
export class ManagementStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const config = new jompx.Config(this.node);
        const environment = config.environmentByEnv(props?.env);

        // Create SES verified domain entities for all domains.
        if (environment?.name) {
            config.domains?.forEach(domain => {
                const domainName = `${environment.name}.${domain.rootDomainName}`;
                new jompx.SesDomainEntity(this, `SesDomainEntity${changeCase.pascalCase(environment.name)}`, {
                    domainName
                });
            });
        }

        // Create biling alarm.
        new jompx.BillingAlarm(this, 'BillingAlarm', {
            estimatedMonthlyThreshold: 5,
            topicSubscriptions: config.emailsByTag('billing')?.map(email => new subscriptions.EmailSubscription(email))
        });
    }
}
