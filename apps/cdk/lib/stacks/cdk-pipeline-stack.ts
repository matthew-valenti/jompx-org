import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as jompx from '@jompx/constructs';
import { CdkAppStage } from './cdk-app-stage';
import get = require('get-value');

export class CdkPipelineStack extends cdk.Stack {

    public props: cdk.StackProps | undefined;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        this.props = props;

        const config = new jompx.Config(this.node);
        const stage = config.stage();

        const jompxCdkPipelineProps: jompx.ICdkPipelineProps = {
            stage,
            gitHub: {
                owner: 'matthew-valenti',
                repo: 'jompx-org',
                connectionArn: stage === 'prod' ? '' : 'arn:aws:codestar-connections:us-west-2:863054937555:connection/38e739e3-ed21-4dbc-98f9-b97e40764d5b'
                // token: SecretValue.secretsManager('cicd/github/token')
            }
        };

        // Create CDK CodePipeline.
        const cdkPipeline = new jompx.CdkPipeline(this, 'CdkPipeline', jompxCdkPipelineProps);
        cdkPipeline.environmentPipelines.forEach(environmentPipeline => {
            const branch = environmentPipeline.branch;
            const pipeline = environmentPipeline.pipeline;

            const regex = /(\d+)/gm;
            const branchIndex = get(regex.exec(branch) ?? [], '1');

            switch (true) {
                // Deploy to prod.
                case (branch === 'main'):
                    pipeline.addStage(new CdkAppStage(this, 'CdkAppStageTest', { ...this.props, env: config.env('main', 'test') })); // Deploy to test env first. 
                    pipeline.addStage(new CdkAppStage(this, 'CdkAppStageProd', { ...this.props, env: config.env('main') }));
                    break;
                // Deploy to test.
                case (branch === 'test'):
                    pipeline.addStage(new CdkAppStage(this, 'CdkAppStageTest', { ...this.props, env: config.env('main', 'test') }));
                    break;
                // Deploy to sandbox (including manual CLI deploy to developer sandbox defined in local config).
                case (branch.includes(`-sandbox${branchIndex}-`)):
                    pipeline.addStage(new CdkAppStage(this, `CdkAppStageSandbox`, { ...this.props, env: config.env('main', `sandbox${branchIndex}`) }));
                    break;
            }
        });
    }
}
