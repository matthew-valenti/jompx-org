import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { Config } from '@jompx-org/config';

/*
Management account only. Restricted access. To be deployed to the AWS management account only.
Stack does NOT have a stage. There is no "test" management account. AWS only allows one manager/master account (that manages all other accounts).
It is best practice NOT to deploy resources to the managmeent account. However, we do need some bare essentials e.g. billing alarm, organization trail, etc.
*/
export class TestManagementStack extends cdk.Stack {
    public athenaResultsBucket: cdk.aws_s3.Bucket;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const config = new Config(this.node);
        const environment = config.environmentByEnv(props?.env);

        // Setup Athena query results bucket.
        this.athenaResultsBucket = new s3.Bucket(this, 'AthenaResults', {
            bucketName: `${config.value.organization.name}-${environment?.name}-athena-results`,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            encryption: s3.BucketEncryption.S3_MANAGED,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
        });
    }
}
