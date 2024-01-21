import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as changeCase from 'change-case';
import * as jompx from '@jompx/constructs';
import { Config } from '@jompx-org/config';

/*
Management account only. Restricted access. To be deployed to the AWS management account only.
Stack does NOT have a stage. There is no "test" management account. AWS only allows one manager/master account (that manages all other accounts).
It is best practice NOT to deploy resources to the managmeent account. However, we do need some bare essentials e.g. billing alarm, organization trail, etc.
*/
export class ManagementStack extends cdk.Stack {
    public athenaResultsBucket: cdk.aws_s3.Bucket;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const config = new Config(this.node);
        const environment = config.environmentByEnv(props?.env);

        if (environment?.name) {
            // Create SES verified domain entities for all domains.
            config.value.domains?.forEach(domain => {
                const domainName = `${environment.name}.${domain.rootDomainName}`;
                new jompx.SesDomainEntity(this, `SesDomainEntity${changeCase.pascalCase(environment.name)}`, {
                    domainName
                });
            });

            // Create biling alarm.
            new jompx.BillingAlarm(this, 'BillingAlarm', {
                environmentName: environment?.name,
                estimatedMonthlyThreshold: 5,
                topicSubscriptions: config.emailsByTag('billing')?.map(email => new subscriptions.EmailSubscription(email))
            });
        }

        // Create organization trail.
        new jompx.OrganizationTrail(this, 'OrganizationTrail', {
            bucketName: `${config.value.organization.name}-${config.environmentByName('security')?.name}-organization-trail`,
        });
    }
}
