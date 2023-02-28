import * as cdk from 'aws-cdk-lib';
import * as ses from 'aws-cdk-lib/aws-ses';
import { Construct } from "constructs";
import * as jompx from '@jompx/constructs';

export class CommunicationStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const config = new jompx.Config(this.node);

        config.apps()?.forEach(app => {
            new ses.EmailIdentity(this, 'AppRootDomainNameIdentity', {
                identity: ses.Identity.domain(app.rootDomainName),
            });
        });
    }
}