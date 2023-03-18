import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from "constructs";
import * as jompx from '@jompx/constructs';

/**
 * Resources that generally require a one-time setup (and likely be used across stacks).
 */
export class SetupStack extends cdk.Stack {
    public athenaResultsBucket: cdk.aws_s3.Bucket;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const config = new jompx.Config(this.node);

        // Setup Athena query results bucket.
        this.athenaResultsBucket = new s3.Bucket(this, 'AthenaResults', {
            bucketName: `${config.organizationName}-${config.stage}-athena-results`,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            encryption: s3.BucketEncryption.S3_MANAGED,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
        });
    }
}
