import * as cdk from 'aws-cdk-lib';
import * as athena from 'aws-cdk-lib/aws-athena';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import * as jompx from '@jompx/constructs';
import { Config } from '@jompx-org/config';

/*
Restricted access. To be deployed to the AWS security account only.
Stack does NOT have a stage i.e. there is no "test" security account.
*/
export class SecurityStack extends cdk.Stack {
    public athenaResultsBucket: cdk.aws_s3.Bucket;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const config = new Config(this.node);
        const organizationEnvironment = config.environmentByName('management');

        // Setup Athena query results bucket.
        this.athenaResultsBucket = new s3.Bucket(this, 'AthenaResults', {
            bucketName: `aws-athena-query-results-${this.account}-${this.region}`,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            encryption: s3.BucketEncryption.S3_MANAGED,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
        });

        // Create organization trail storage. Logs will be saved to this bucket.
        new jompx.OrganizationTrailStorage(this, 'OrganizationTrailStorage', {
            bucketName: `${config.value.organization.name}-organization-trail`,
            accountId: this.account,
            region: this.region,
            organizationAccount: organizationEnvironment?.accountId ?? '',
            organizationRegion: this.region,
            organizationId: config.value.organization.id,
            athenaQueryResultsS3Url: this.athenaResultsBucket.s3UrlForObject(),
            projection: {
                accountIds: config.accountIds,
                regions: config.regions,
                timestampRange: '2024/01/01,NOW'
            },
            expiration: cdk.Duration.days(7)
        });
    }
}
