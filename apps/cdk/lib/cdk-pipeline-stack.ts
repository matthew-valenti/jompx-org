import { Stack, StackProps, SecretValue } from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import * as changeCase from 'change-case';
import * as jompx from '@jompx/constructs';
import { CdkAppStage } from './cdk-app-stage';
import get = require('get-value');

export class CdkPipelineStack extends Stack {

    public props: StackProps | undefined;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        this.props = props;

        const config = new jompx.Config(this.node);

        const jompxCdkPipelineProps: jompx.ICdkPipelineProps = {
            stage: config.stage(),
            gitHub: {
                owner: 'matthew-valenti',
                repo: 'jompx-org',
                token: SecretValue.secretsManager('cicd/github/token')
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
                    pipeline.addStage(new CdkAppStage(this, `CdkAppStageSandbox${branchIndex}`, { ...this.props, env: config.env('main', `sandbox${branchIndex}`) }));
                    break;
                // Manual CLI deploy to developer sandbox. Match unique sandbox. e.g. sandbox1-sandbox1
                // case (branch.includes(`-${config.stage()}-${config.stage()}-`)):
                //     pipeline.addStage(new CdkAppStage(this, 'CdkAppStageMySandbox', { ...this.props, env: config.env('main', config.stage()) }));
                //     break;
            }
        });

        // Add an optional manual approval step. Manual approval is required in AWS CodePipeline (in CdkAppStageProd stage).
        // stage.addPre(new pipelines.ManualApprovalStep('approval'));

        // Add an optional shell step.
        // cdkAppStageTest.addPost(new pipelines.ShellStep('AppDeployStageTest', {
        //     env: {
        //         STAGE: `${stage}`
        //     },
        //     commands: ['echo STAGE=$STAGE']
        // }));


        // // On main branch changes, deploy to prod accounts (via test accounts).
        // if (stage === 'prod') {

        //     // Main CDK app stage(s) to prod and test.
        //     const cdkAppStageTest = cdkPipeline.pipeline.addStage(new CdkAppStage(this, 'CdkAppStageTest', { ...this.props, env: config.env('cdk', 'test') })); // Deploy to test env first.
        //     const cdkAppStageProd = cdkPipeline.pipeline.addStage(new CdkAppStage(this, 'CdkAppStageProd', { ...this.props, env: config.env('cdk') }));

        //     // Common CDK app stage(s) to prod and test.

        //     // Add an optional manual approval step. Manual approval is required in AWS CodePipeline (in CdkAppStageProd stage).
        //     // pipelineStage.addPre(new pipelines.ManualApprovalStep('approval'));

        //     // Add an optional shell step.
        //     // cdkAppStageTest.addPost(new pipelines.ShellStep('AppDeployStageTest', {
        //     //     env: {
        //     //         STAGE: `${stage}`
        //     //     },
        //     //     commands: ['echo STAGE=$STAGE']
        //     // }));
        // }

        // // On test branch changes, deploy to test accounts.
        // if (stage === 'test') {

        //     // Main CDK app stage(s) to test.
        //     const cdkAppStageTest = cdkPipeline.pipeline.addStage(new CdkAppStage(this, 'CdkAppStageTest', { ...this.props, env: config.env('cdk') }));

        //     // Common CDK app stage(s) to test.
        // }

        // if (stage === 'local') {
        //     cdkPipeline.pipeline.addStage(new CdkAppStage(this, 'CdkAppStageLocal', { ...this.props, env: config.env('cdk') }), { });
        // }

        // 3. Deploy frontend apps. Wave? But what if CDK fails (which is more likely than app)? Probably need to do sync.
    }

    // private createCdkPipeline() {

    //     const config = new jompx.Config(this.node);
    //     const stage = config.stage();

    //     const jompxCdkPipelineProps: jompx.ICdkPipelineProps = {
    //         stage,
    //         github: {
    //             owner: 'matthew-valenti',
    //             repo: 'jompx-org',
    //             token: SecretValue.secretsManager('cicd/github/token')
    //         }
    //     };

    //     // Create CDK CodePipeline.
    //     const cdkPipeline = new jompx.CdkPipeline(this, 'CdkPipeline', jompxCdkPipelineProps);

    //     // On main branch changes, deploy to prod accounts (via test accounts).
    //     if (stage === 'prod') {

    //         // Main CDK app stage(s) to prod and test.
    //         const cdkAppStageTest = cdkPipeline.pipeline.addStage(new CdkAppStage(this, 'CdkAppStageTest', { ...this.props, env: config.env('cdk', 'test') })); // Deploy to test env first.
    //         const cdkAppStageProd = cdkPipeline.pipeline.addStage(new CdkAppStage(this, 'CdkAppStageProd', { ...this.props, env: config.env('cdk') }));

    //         // Common CDK app stage(s) to prod and test.

    //         // Add an optional manual approval step. Manual approval is required in AWS CodePipeline (in CdkAppStageProd stage).
    //         // pipelineStage.addPre(new pipelines.ManualApprovalStep('approval'));

    //         // Add an optional shell step.
    //         // cdkAppStageTest.addPost(new pipelines.ShellStep('AppDeployStageTest', {
    //         //     env: {
    //         //         STAGE: `${stage}`
    //         //     },
    //         //     commands: ['echo STAGE=$STAGE']
    //         // }));
    //     }

    //     // On test branch changes, deploy to test accounts.
    //     if (stage === 'test') {

    //         // Main CDK app stage(s) to test.
    //         const cdkAppStageTest = cdkPipeline.pipeline.addStage(new CdkAppStage(this, 'CdkAppStageTest', { ...this.props, env: config.env('cdk') }));

    //         // Common CDK app stage(s) to test.
    //     }

    //     if (stage === 'local') {
    //         cdkPipeline.pipeline.addStage(new CdkAppStage(this, 'CdkAppStageLocal', { ...this.props, env: config.env('cdk') }), { });
    //     }

    //     // 3. Deploy frontend apps. Wave? But what if CDK fails (which is more likely than app)? Probably need to do sync.
    // }

    // private createCdkPipelineBranch() {

    //     const config = new jompx.Config(this.node);

    //     const jompxCdkPipelineBranchProps: jompx.ICdkPipelineBranchProps = {
    //         environmentNameSubstring: 'sandbox',
    //         gitHubOwner: 'matthew-valenti',
    //         gitHubRepo: 'jompx-org',
    //         // shellStepInput: pipelines.CodePipelineSource.gitHub(
    //         //     'matthew-valenti/jompx-org',
    //         //     stage === 'prod' ? 'main' : 'pipeline', // TODO: change pipeline branch to: test
    //         //     { authentication: SecretValue.secretsManager('cicd/github/token') }
    //         // )
    //     };

    //     // Create CDK CodePipeline.
    //     const cdkPipelineBranch = new jompx.CdkPipelineBranch(this, 'CdkPipelineBranch', jompxCdkPipelineBranchProps);

    //     cdkPipelineBranch.environmentPipelines.forEach((environmentPipeline) => {
    //         const environment = environmentPipeline.environment;
    //         environmentPipeline.pipeline.addStage(new CdkAppStage(this, `CdkAppStage${changeCase.pascalCase(environment.name)}`, { ...this.props, env: config.env('cdk', environment.name) })); // Always deploy to sandbox environment.
    //     });
    // }
}

/*
cdkAppStageTest.addPost(
    // new pipelines.ShellStep('AppDeployStageTest', {
    //     env: {
    //         STAGE: `${stage}`
    //     },
    //     commands: ['echo STAGE=$STAGE']
    // })
    new pipelines.CodeBuildStep('AppDeployStageTest', {
        commands: [
            'echo STAGE=$STAGE'
        ],
        // partialBuildSpec: codebuild.BuildSpec.fromObject({
        //     version: 0.2,
        //     env: {
        //         variables: {
        //             STAGE: `${stage}`
        //         }
        //     },
        //     phases: {
        //         install: {
        //             commands: [
        //                 'echo !!!!!!!!!!!!!!!!!!!!!!!!!install!!!!!!!!!!!!!!!!!!!!!!!!!',
        //                 'echo STAGE=$STAGE',
        //             ]
        //         },
        //         build: {
        //             commands: [
        //                 'echo !!!!!!!!!!!!!!!!!!!!!!!!!build!!!!!!!!!!!!!!!!!!!!!!!!!',
        //                 'echo STAGE=$STAGE',
        //             ]
        //         },
        //     },
        // }),
    })
);
*/