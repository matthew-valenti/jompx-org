import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as jompx from '@jompx/constructs';
import { AppStage } from '../stages/app-stage';
import { DnsStage } from '../stages/dns-stage';
import get = require('get-value');

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
                connectionArn: stage === 'prod' ? '' : 'arn:aws:codestar-connections:us-west-2:863054937555:connection/38e739e3-ed21-4dbc-98f9-b97e40764d5b'
                // token: SecretValue.secretsManager('cicd/github/token')
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

            switch (true) {
                // When stage = prod, listen for changes on branch main:
                case (branch === 'main'):
                    pipeline.addStage(new DnsStage(this, 'DnsStage', { ...this.props, env: config.env('dns') }));
                    pipeline.addStage(new AppStage(this, 'AppStageTest', { ...this.props, env: config.env('app', 'test') })); // Deploy to test env first (override env stage to test).
                    pipeline.addStage(new AppStage(this, 'AppStage', { ...this.props, env: config.env('app') }));
                    break;
                // When stage = test, listen for changes on branch: test.
                // When stage = test, listen for changes on branch: test-test.
                case (branch === 'test' || branch === 'test-test'):
                    // pipeline.addStage(new DnsStage(this, 'DnsStage', { ...this.props, env: config.env('dns') })); // For temporary testing only (in test env). Delete stack after use.
                    pipeline.addStage(new AppStage(this, 'AppStage', { ...this.props, env: config.env('app') }));
                    break;
                // When stage = sandbox1, listen for changes on branch containing: sandbox1
                // Developers can also deploy via CLI and should have their stage set to their sandbox e.g. stage: 'sandbox1'
                case (branch.includes(`sandbox${branchIndex}`)):
                    pipeline.addStage(new AppStage(this, `AppStage`, { ...this.props, env: config.env('app', `sandbox${branchIndex}`) }));
                    break;
            }
        }
    }
}
