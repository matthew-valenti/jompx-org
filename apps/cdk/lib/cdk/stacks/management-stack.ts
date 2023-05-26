import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as changeCase from 'change-case';
import * as jompx from '@jompx/constructs';

/*
Management account only. Restricted access. To be deployed to the AWS management account only.
Stack does NOT have a stage. There is no "test" management account. AWS only allows one manager/master account (that manages all other accounts).
It is best practice NOT to deploy resources to the managmeent account. However, we do need some bare essentials e.g. billing alarm, organization trail, etc.
*/
export class ManagementStack extends cdk.Stack {
    public athenaResultsBucket: cdk.aws_s3.Bucket;

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

        // Setup Athena query results bucket.
        this.athenaResultsBucket = new s3.Bucket(this, 'AthenaResults', {
            bucketName: `${config.organizationName}-${environment?.name}-athena-results`,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            encryption: s3.BucketEncryption.S3_MANAGED,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
        });

        // Create organization trail.
        new jompx.OrganizationTrail(this, 'OrganizationTrail', {
            accountId: props?.env?.account ?? '',
            region: props?.env?.region ?? '',
            organizationAccount: props?.env?.account ?? '',
            organizationRegion: props?.env?.region ?? '',
            organizationId: config.organizationId,
            athenaQueryResultsS3Url: this.athenaResultsBucket.s3UrlForObject(),
            projection: {
                accountIds: config.accountIds,
                regions: config.regions,
                timestampRange: '2023/03/10,NOW'
            },
            expiration: cdk.Duration.days(30)
        });
    }
}
