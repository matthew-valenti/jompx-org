import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from "constructs";
import * as jompx from '@jompx/constructs';

export class CommunicationStack extends cdk.Stack {

    public vpc: ec2.Vpc;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const config = new jompx.Config(this.node);

        this.vpc = new ec2.Vpc(this, 'Vpc', {
            // When you create a VPC, we recommend that you specify a CIDR block from the private IPv4 address ranges as specified in RFC 1918.
            // You cannot increase or decrease the size of an existing CIDR block.
            // Jompx: The CIDR block should not overlap with any other CIDR block across the organization. This allows all VPCs to be connected if needed.
            cidr: '', // VPC CIDR blocks 
            maxAzs: 2,
            // You can use a NAT gateway so that instances in a private subnet can connect to services outside your VPC e.g. the internet.
            // You are charged for each hour that your NAT gateway is available and each Gigabyte of data that it processes.
            natGateways: 0,
            subnetConfiguration: [
                {
                    subnetType: ec2.SubnetType.PUBLIC,
                    name: 'public',
                    cidrMask: 20,
                },
                {
                    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                    name: 'private',
                    cidrMask: 20,
                }
            ],
            vpnGateway: true // Accept VPN connections.
        });

        // this.vpc.addVpnConnection('Dynamic', {
        //     ip: '1.2.3.4'
        // });

        // VPC endpoints ???

        // Client VPN endpoint ???
    }
}