#!/usr/bin/env node
// import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
// import { CdkStack } from '../lib/cdk-stack';
import { CdkPipelineStack } from '../lib/cdk-pipeline-stack';
// import { TestStack } from '../lib/test-stack';
// import { S3Stack } from '../lib/s3-stack';
// import config from '../config';

// const yaml = require('js-yaml');
// const fs   = require('fs');

// import { load } from 'js-yaml';
// import { readFileSync } from "fs";

// import { yamlParse } from 'yaml-cfn';

// const yaml = yamlParse(readFileSync('../org-formation/organization.yml', 'utf8')); // as YourType;
// const yaml = yamlParse(readFileSync('../org-formation/organization.yml', 'utf8')); // as YourType;
// const yamlJson = JSON.stringify(yaml, null, 2);
// console.log('yamlJson', yamlJson);

const app = new cdk.App({
    // context: { config, ...{'@app': {stage: 'test'}} }
    // context: {
    //     anything: {name: 'John', age: 28, x: [1,2,3]},
    //   }
    }
);

// jompx.getAccountIdFromName('cicd-test');

// console.log('app.node.tryGetContext', app.node.tryGetContext('@app').stage);

// cicd if cli context = test then deploy to test account otherwise production.

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

    env: app.node.tryGetContext('stage') === 'prod' ? { account: '896371249616', region: 'us-west-2' } : { account: '863054937555', region: 'us-west-2' }
  });