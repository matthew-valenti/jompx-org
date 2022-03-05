import { Stack, StackProps, SecretValue } from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import * as changeCase from 'change-case';
import * as jompx from '@jompx/constructs';
import { CdkAppStage } from './cdk-app-stage';

export class CdkPipelineStack extends Stack {

    public props: StackProps | undefined;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        this.props = props;

        this.createCdkPipeline();
        this.createCdkPipelineBranch();
    }

    private createCdkPipeline() {
        
        const config = new jompx.Config(this.node);
        const stage = config.stage();

        const jompxCdkPipelineProps: jompx.ICdkPipelineProps = {
            stage,
            shellStepInput: pipelines.CodePipelineSource.gitHub(
                'matthew-valenti/jompx-org',
                stage === 'prod' ? 'main' : 'pipeline', // TODO: change pipeline branch to: test
                { authentication: SecretValue.secretsManager('cicd/github/token') }
            )
        };

        // Create CDK CodePipeline.
        const cdkPipeline = new jompx.CdkPipeline(this, 'CdkPipeline', jompxCdkPipelineProps);

        // On main branch changes, deploy to prod accounts (via test accounts).
        if (stage === 'prod') {

            // Main CDK app stage(s) to prod and test.
            const cdkAppStageTest = cdkPipeline.pipeline.addStage(new CdkAppStage(this, 'CdkAppStageTest', { ...this.props, env: config.env('cdk', 'test') })); // Deploy to test env first.
            const cdkAppStageProd = cdkPipeline.pipeline.addStage(new CdkAppStage(this, 'CdkAppStageProd', { ...this.props, env: config.env('cdk') }));

            // Common CDK app stage(s) to prod and test.

            // Add an optional manual approval step. Manual approval is required in AWS CodePipeline (in CdkAppStageProd stage).
            // pipelineStage.addPre(new pipelines.ManualApprovalStep('approval'));

            // Add an optional shell step.
            // cdkAppStageTest.addPost(new pipelines.ShellStep('AppDeployStageTest', {
            //     env: {
            //         STAGE: `${stage}`
            //     },
            //     commands: ['echo STAGE=$STAGE']
            // }));
        }

        // // On test branch changes, deploy to test accounts.
        if (stage === 'test') {

            // Main CDK app stage(s) to test.
            const cdkAppStageTest = cdkPipeline.pipeline.addStage(new CdkAppStage(this, 'CdkAppStageTest', { ...this.props, env: config.env('cdk') }));

            // Common CDK app stage(s) to test.
        }

        if (stage === 'local') {
            cdkPipeline.pipeline.addStage(new CdkAppStage(this, 'CdkAppStageLocal', { ...this.props, env: config.env('cdk') }));
        }

        // 3. Deploy frontend apps. Wave? But what if CDK fails (which is more likely than app)? Probably need to do sync.
    }

    private createCdkPipelineBranch() {
        
        const config = new jompx.Config(this.node);

        const jompxCdkPipelineBranchProps: jompx.ICdkPipelineBranchProps = {
            environmentNameSubstring: 'sandbox',
            gitHubOwner: 'matthew-valenti',
            gitHubRepo: 'jompx-org',
            // shellStepInput: pipelines.CodePipelineSource.gitHub(
            //     'matthew-valenti/jompx-org',
            //     stage === 'prod' ? 'main' : 'pipeline', // TODO: change pipeline branch to: test
            //     { authentication: SecretValue.secretsManager('cicd/github/token') }
            // )
        };

        // Create CDK CodePipeline.
        const cdkPipelineBranch = new jompx.CdkPipelineBranch(this, 'CdkPipelineBranch', jompxCdkPipelineBranchProps);

        cdkPipelineBranch.environmentPipelines.forEach((environmentPipeline) => {
            const environment = environmentPipeline.environment;
            environmentPipeline.pipeline.addStage(new CdkAppStage(this, `CdkAppStage${changeCase.pascalCase(environment.name)}`, { ...this.props, env: config.env('cdk', environment.name) })); // Always deploy to sandbox environment.
        });
    }
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