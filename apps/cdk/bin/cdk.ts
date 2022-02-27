#!/usr/bin/env node
// import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import * as ssm from 'aws-cdk-lib/aws-ssm';
// import { CdkStack } from '../lib/cdk-stack';
import { CdkPipelineStack } from '../lib/cdk-pipeline-stack';
// import { TestStack } from '../lib/test-stack';
// import { S3Stack } from '../lib/s3-stack';
import * as jompx from '@jompx/constructs';
import { Config as JompxConfig } from '../jompx.config';
import { Local as JompxLocalConfig } from '../jompx.local';
import { Config } from '../config';
import { exitCode } from 'process';

// const yaml = require('js-yaml');
// const fs   = require('fs');

// import { load } from 'js-yaml';
// import { readFileSync } from "fs";

// import { yamlParse } from 'yaml-cfn';

// const yaml = yamlParse(readFileSync('../org-formation/organization.yml', 'utf8')); // as YourType;
// const yaml = yamlParse(readFileSync('../org-formation/organization.yml', 'utf8')); // as YourType;
// const yamlJson = JSON.stringify(yaml, null, 2);
// console.log('yamlJson', yamlJson);

// const latestStringToken = ssm.StringParameter.valueForStringParameter(, 'my-plain-parameter-name');

// Add configs to CDK context. Context is available in the CDK app e.g. app.node.tryGetContext('@jompx').organizationName
const app = new cdk.App({
    context: { ...JompxConfig, ...JompxLocalConfig, ...Config }
});

// Init Jompx config.
const jompxConfig = new jompx.Config(app.node);

/**
 * CDK continuous integration and delivery (CI/CD) stack.
 * This stack must be manually deployed to test and prod accounts one time only. Pipeline is self mutating on subsequent source control commits.
 * Deploy to test cicd account by default.
 * Deploy to prod cicd account by passing context variable to deploy e.g. --context stage=prod
 */
new CdkPipelineStack(app, 'CdkPipelineStack', {
    /* If you don't specify 'env', this stack will be environment-agnostic.
     * Account/Region-dependent features and context lookups will not work,
     * but a single synthesized template can be deployed anywhere. */

    /* Uncomment the next line to specialize this stack for the AWS Account
     * and Region that are implied by the current CLI configuration. */
    // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

    /* Uncomment the next line if you know exactly what Account and Region you
     * want to deploy the stack to. */
    // env: { account: '123456789012', region: 'us-east-1' },

    /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */

    // Deploy stack to prod: nx synth cdk --args="CdkPipelineStack --context env=cicd-prod"
    env: jompxConfig.getEnv('cicd')
    // env: app.node.tryGetContext('stage') === 'prod' ? config.getEnv('cicd-prod') : config.getEnv('cicd-test')
});