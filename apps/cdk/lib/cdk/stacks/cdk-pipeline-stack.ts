import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as jompx from '@jompx/constructs';
import { AppStage } from '../stages/app-stage';
import { AccountStage } from '../stages/account-stage';
import { DnsStage } from '../stages/dns-stage';
// import { ManagementStage } from '../stages/management-stage';
import get = require('get-value');

/**
 * Create a stage to deploy a set of stacks to specific AWS accounts.
 * Generally, we don't want to deploy all stacks to all environments.
 * Organization: Deploy resources to the the organization AWS account only. For organization management only (not general services).
 * All Stage: Deploy resources to ALL AWS accounts EXCEPT organization. Use to deploy common resources across all AWS accounts.
 * DNS Stage: Deploy resources to prod only. // TODO: Why?
 * App Stage: Deploy application related resources to sandbox, test, and prod AWS accounts.
 * 
 * TODO: Is the test AWS account for human QA or a pass-thru account for CDK deploy testing only.
 * Perhaps test is owned by the developers and is pass-thru only while UAT is a separate account owned by the business.
*/
export class CdkPipelineStack extends cdk.Stack {

    public props: cdk.StackProps | undefined;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        this.props = props;

        const config = new jompx.Config(this.node);
        const stage = config.stage();
        console.log(`debug: stage=${stage}`);

        const jompxCdkPipelineProps: jompx.ICdkPipelineProps = {
            stage,
            gitHub: {
                owner: 'matthew-valenti',
                repo: 'jompx-org',
                // connectionArn: stage === 'prod' ? '' : 'arn:aws:codestar-connections:us-west-2:863054937555:connection/ebb40ed7-02c9-4916-a3ac-f9e965e8f4a4'
                // token: SecretValue.secretsManager('cicd/github/token')
                connectionArn: cdk.SecretValue.secretsManager('/cicd/github/token').toString()
            }
        };

        // Create CDK pipelines. Two pipelines per stage (one for each CICD stage). e.g. prod, test-prod.
        const cdkPipeline = new jompx.CdkPipeline(this, 'CdkPipeline', jompxCdkPipelineProps);

        // Get the pipeline for this stage.
        const environmentPipeline = cdkPipeline.environmentPipelines.find(o => o.pipelineStage === stage);
        if (environmentPipeline) {

            const pipeline = environmentPipeline.pipeline;
            const branch = environmentPipeline.branch;
            const regex = /(\d+)/gm;
            const branchIndex = get(regex.exec(branch) ?? [], '1');

            // TODO: What about a test stack for test- branches. That way we can test the CICD process without actually deploying resources. So test-main could deploy to prod safely?
            // TODO: Add wave for performance???

            console.log('!!!!branch', branch);
            // switch (true) {
            //     // When stage = prod, listen for changes on branch main:
            //     case (branch === 'main'):

            //         // Deploy to organization AWS account.
            //         // pipeline.addStage(new ManagementStage(this, 'ManagementStage', { ...this.props, env: config.env('management') }));

            //         // Deploy to all AWS accounts. Deploy to test account first.
            //         pipeline.addStage(new AllStage(this, 'AllStageTest', { ...this.props, env: config.env('app', 'test') })); // Deploy to test env first (override env stage to test).
            //         pipeline.addStage(new AllStage(this, 'AllStageApp', { ...this.props, env: config.env('app') }));
            //         pipeline.addStage(new AllStage(this, 'AllStageCiCd', { ...this.props, env: config.env('cicd') }));

            //         pipeline.addStage(new DnsStage(this, 'DnsStage', { ...this.props, env: config.env('dns') }));
            //         pipeline.addStage(new AppStage(this, 'AppStageTest', { ...this.props, env: config.env('app', 'test') })); // Deploy to test env first (override env stage to test).
            //         pipeline.addStage(new AppStage(this, 'AppStage', { ...this.props, env: config.env('app') }));

            //         break;
            //     // When stage = test, listen for changes on branch: test.
            //     // When stage = test, listen for changes on branch: test-test.
            //     case (branch === 'test' || branch === 'test-test'):
            //         // pipeline.addStage(new DnsStage(this, 'DnsStage', { ...this.props, env: config.env('dns') })); // For temporary testing only (in test env). Delete stack after use.
            //         pipeline.addStage(new AllStage(this, 'AllStage', { ...this.props, env: config.env('app') })); // For manual deploy to test environment for troubleshooting issues.
            //         pipeline.addStage(new AppStage(this, 'AppStage', { ...this.props, env: config.env('app') })); // For manual deploy to test environment for troubleshooting issues.
            //         break;
            //     // When stage = sandbox1, listen for changes on branch containing: sandbox1
            //     // Developers can also deploy via CLI and should have their local config stage set to their sandbox e.g. stage: 'sandbox1'
            //     case (branch.includes(`sandbox${branchIndex}`)):
            //         pipeline.addStage(new AllStage(this, 'AllStage', { ...this.props, env: config.env('app', `sandbox${branchIndex}`) }));
            //         pipeline.addStage(new AppStage(this, 'AppStage', { ...this.props, env: config.env('app', `sandbox${branchIndex}`) }));
            //         break;
            // }

            switch (true) {
                // When stage = prod, listen for changes on branch main:
                case (branch === 'main'):

                    // Deploy to test environments first. If successful then deploy to production environments.
                    pipeline.addStage(new AccountStage(this, 'AccountStageTest', { ...this.props, env: config.env('test') })); // Deploy to test env first. 
                    pipeline.addStage(new AccountStage(this, 'AccountStageCiCdTest', { ...this.props, env: config.env('cicd-test') }));
                    pipeline.addStage(new AppStage(this, 'AppStageTest', { ...this.props, env: config.env('test') }));

                    // Deploy to production environments.
                    pipeline.addStage(new AccountStage(this, 'AccountStageCiCd', { ...this.props, env: config.env('cicd-prod') }));
                    pipeline.addStage(new AccountStage(this, 'AccountStageProd', { ...this.props, env: config.env('prod') }));
                    pipeline.addStage(new DnsStage(this, 'DnsStage', { ...this.props, env: config.env('prod') }));
                    pipeline.addStage(new AppStage(this, 'AppStage', { ...this.props, env: config.env('prod') }));
                    break;

                // When stage = test, listen for changes on branch: test.
                // When stage = test, listen for changes on branch: test-test.
                case (branch === 'test' || branch === 'test-test'):
                    pipeline.addStage(new AccountStage(this, 'AccountStageTest', { ...this.props, env: config.env('test') })); // Deploy to test env first. 
                    pipeline.addStage(new AccountStage(this, 'AccountStageCiCdTest', { ...this.props, env: config.env('cicd-test') }));
                    pipeline.addStage(new AppStage(this, 'AppStageTest', { ...this.props, env: config.env('test') }));
                    // pipeline.addStage(new DnsStage(this, 'DnsStage', { ...this.props, env: config.env('prod') })); // For temporary testing only (in test environments). Delete stack after use.
                    break;
                    
                // When stage = sandbox1, listen for changes on branch containing: sandbox1
                // Developers can also deploy via CLI and should have their local config stage set to their sandbox e.g. stage: 'sandbox1'
                case (branch.includes(`sandbox${branchIndex}`)):
                    pipeline.addStage(new AccountStage(this, 'AccountStage', { ...this.props, env: config.env(`sandbox${branchIndex}`) }));
                    pipeline.addStage(new AppStage(this, 'AppStage', { ...this.props, env: config.env(`sandbox${branchIndex}`) }));
                    break;
            }
        }
    }
}
