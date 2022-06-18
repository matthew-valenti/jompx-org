import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import { DnsStack } from '@cdk/lib/cdk/stacks/dns-stack';

export class NetworkStage extends cdk.Stage {

    constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);

        
    }
}