import { Stack, StackProps, SecretValue } from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
// Construct does not synth when package.json dependency is file. Move construct file to local (local development workaround).
// import { JompxCdkPipeline, IJompxCdkPipelineProps } from './xxxcdk-pipeline-construct';
import { Config, JompxCdkPipeline, IJompxCdkPipelineProps } from '@jompx/constructs';
import { CdkAppStage } from './cdk-app-stage';

export class CdkPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const jompxConfig = new Config(this.node);
        const stage = jompxConfig.getStage();

        const jompxCdkPipelineProps: IJompxCdkPipelineProps = {
            stage,
            shellStepInput: pipelines.CodePipelineSource.gitHub(
                'matthew-valenti/jompx-org',
                stage === 'prod' ? 'main' : 'pipeline', // TODO: change pipeline branch to: test
                { authentication: SecretValue.secretsManager('cicd/github/token') }
            )
        };

        // Create CDK CodePipeline.
        const cdkPipeline = new JompxCdkPipeline(this, 'JompxCdkPipeline', jompxCdkPipelineProps);

        // On main branch changes, deploy to prod accounts (via test accounts).
        if (stage === 'prod') {

            // Main CDK app stage(s) to prod and test.
            const cdkAppStageTest = cdkPipeline.pipeline.addStage(new CdkAppStage(this, 'CdkAppStageTest', { ...props, env: jompxConfig.getEnv('cdk', 'test') }));
            const cdkAppStageProd = cdkPipeline.pipeline.addStage(new CdkAppStage(this, 'CdkAppStageProd', { ...props, env: jompxConfig.getEnv('cdk', 'prod') })); // TODO: Add when prod env exists.

            // Common CDK app stage(s) to prod and test.

            // Add an optional manual approval step. Manual approval is required in AWS CodePipeline (in CdkAppStageProd stage).
            // pipelineStage.addPre(new pipelines.ManualApprovalStep('approval'));
        }

        // // On test branch changes, deploy to test accounts.
        if (stage === 'test') {

            // Main CDK app stage(s) to test.
            const cdkAppStageTest = cdkPipeline.pipeline.addStage(new CdkAppStage(this, 'CdkAppStageTest', { ...props, env: jompxConfig.getEnv('cdk') }));

            cdkAppStageTest.addPost(new pipelines.ShellStep('AppDeployStageTest', {
                env: {
                    STAGE: `${stage}`
                },
                commands: ['echo STAGE=$STAGE']
            }));

            // Common CDK app stage(s) to test.
        }

        if (stage === 'local') {
            // Main CDK app stage(s) to test.
            cdkPipeline.pipeline.addStage(new CdkAppStage(this, 'CdkAppStageLocal', { ...props, env: jompxConfig.getEnv('cdk') }));
        }

        // 3. Deploy frontend apps. Wave? But what if CDK fails (which is more likely than app)? Probably need to do sync.
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