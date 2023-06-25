import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as changeCase from 'change-case';
import * as jompx from '@jompx/constructs';
import { Config } from '@jompx-org/config';

export class HostingStack extends cdk.Stack {

    // Share wild card certificates with other stacks.
    public certificates = new Map<string, acm.Certificate>();

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const config = new Config(this.node);

        const environment =  config.environmentById(props?.env?.account);
        if (!environment) return;

        const rootDomainNames = config.appRootDomainNames;
        const apps = config.value.apps;

        if (apps) {

            // Create one wildcard certificate per unique app domain. Created in US East (N. Virginia) region.
            const hostingCertificates = new Map<string, jompx.HostingCertificate>();
            rootDomainNames?.forEach(rootDomainName => {
                const hostingCertificate = new jompx.HostingCertificate(this, 'HostingCertificate', {
                    environmentName: environment.name,
                    rootDomainName
                });
                hostingCertificates.set(rootDomainName, hostingCertificate);
            });

            apps.forEach(app => {
                const appNamePascalCase = changeCase.pascalCase(app.name);

                // Derive the app domain name from environment name e.g. admin.jompx.com, admin.test.jompx.com, admin.sandbox1.admin.com
                const domainName = environment.name === 'prod' ? `${app.name}.${app.rootDomainName}` : `${app.name}.${environment.name}.${app.rootDomainName}`;

                const zone = route53.PublicHostedZone.fromLookup(this, 'LookupHostedZone', { domainName: `${environment.name}.${app.rootDomainName}` });
                const certificate = hostingCertificates.get(app.rootDomainName)?.certificate;
                
                if (certificate) {
                    this.certificates.set(app.rootDomainName, certificate);
                }

                if (zone && certificate) {

                    // Create one S3 bucket per app.
                    const hostingS3 = new jompx.HostingS3(this, `HostingS3${appNamePascalCase}`, {
                        domainName
                    });

                    // Create one CloudFront distribution per app.
                    const hostingCloudFront = new jompx.HostingCloudFront(this, `HostingCloudFront${appNamePascalCase}`, {
                        organizationName: config.value.organization.name,
                        domainName,
                        bucket: hostingS3.bucket,
                        certificate,
                        // Include 'ngsw-cache-bust' in cache key to allow Angluar Service Worker cache busting.
                        cachePolicyQueryStringAllowList: cloudfront.CacheQueryStringBehavior.allowList('ngsw-cache-bust')
                    });

                    // Set up Route53 aliases records for the CloudFront distribution. i.e. point the app domain to CloudFront.
                    new route53.ARecord(this, 'ARecord', {
                        zone,
                        target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(hostingCloudFront.distribution)),
                        recordName: app.name
                    });

                    const pipelineS3 = new jompx.AppPipelineS3(this, `AppPipelineS3${appNamePascalCase}`);

                    const codebuildBuildSpecObject = {
                        version: 0.2,
                        env: {
                            variables: {
                                ENVIRONMENT_NAME: `${environment.name}`,
                                BUCKET_NAME: `${hostingS3.bucket.bucketName}`,
                                APP_NAME: `${app.name}`
                            }
                        },
                        phases: {
                            install: {
                                commands: [
                                    'npm ci',
                                    'npm install -g @angular/cli > /dev/null',
                                    'npm install -g @ionic/cli',
                                    'npm install -g @aws-amplify/cli'
                                ]
                            },
                            build: {
                                commands: [
                                    'echo ENVIRONMENT_NAME=$ENVIRONMENT_NAME',
                                    'echo APP_NAME=$APP_NAME',
                                    'ionic build --project $APP_NAME'
                                    // TODO: When app configuration files setup.
                                    // 'ionic build --project $APP_NAME --configuration=$ENVIRONMENT_NAME'
                                ]
                            },
                            post_build: {
                                commands: [
                                    'if [ $CODEBUILD_BUILD_SUCCEEDING = 1 ]; then aws s3 sync "apps/$APP_NAME/www/" "s3://$BUCKET_NAME/" --delete" --quiet; fi'
                                ]
                            }
                        }
                    };

                    // Move this to the CICD environment. Can it be done without adding additional complexity.
                    new jompx.AppPipeline(this, `AppPipeline${appNamePascalCase}`, {
                        environmentName: environment.name,
                        appName: app.name,
                        branch: '', // TODO: Fix this.
                        hostingBucket: hostingS3.bucket,
                        pipelinegBucket: pipelineS3.bucket,
                        gitHub: {
                            owner: 'matthew-valenti',
                            repo: 'jompx-org',
                            token: cdk.SecretValue.secretsManager('/cicd/github/token')
                        },
                        codebuildBuildSpecObject
                    });
                }
            });
        }
    }
}