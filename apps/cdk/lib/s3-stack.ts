import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from 'aws-cdk-lib/pipelines';
import { PipelineStage } from './pipeline-stage';
// import {
//   JompxCdkPipeline,
//   JompxCdkPipelineProps,
// } from './cdk-pipeline-construct';
// import { JompxCdkPipeline, IJompxCdkPipelineProps } from '@jompx/constructs';
import { JompxS3 } from '@jompx/constructs';

export class S3Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new JompxS3(this, 'JompxS3');
  }
}
