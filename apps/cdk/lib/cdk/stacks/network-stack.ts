import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { Tags } from 'aws-cdk-lib';
import * as jompx from '@jompx/constructs';

export class NetworkStack extends cdk.Stack {

    public vpc: ec2.Vpc;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const config = new jompx.Config(this.node);
        const cidr = '10.2.0.0';

        // TODO: Combine all configs into one file. Move file to root. We just need to type it with && so we have jompx and custom config.
        //  vpcs: [
        //     {
        //         environmentName: 'prod',
        //         cidr: '10.0.0.0'
        //     },
        //     {
        //         environmentName: 'test',
        //         cidr: '10.1.0.0'
        //     },
        //     {
        //         environmentName: 'sandbox1',
        //         cidr: '10.2.0.0'
        //     }
        // ],

        // Important: It's easy to create a VPC. It can be hard to create a network for an organization. Do some homework before implementing!
        // This Jompx example is appropriate for a small organization that needs one non-overlapping VPC per AWS account/region and up to 256 VPCs.
        // AWS Region > VPC > Availability Zone > Subnet (private or public) > e.g. EC2.
        // https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html
        // When you create a VPC, we recommend that you specify a CIDR block from the private IPv4 address ranges as specified in RFC 1918.
        // 10.0.0.0 - 10.255.255.255 (10/8 prefix) e.g. 10.0.0.0/16.
        // 172.16.0.0 - 172.31.255.255 (172.16/12 prefix) e.g. 172.31.0.0/16.
        // 192.168.0.0 - 192.168.255.255 (192.168/16 prefix) e.g. 192.168.0.0/20
        this.vpc = new ec2.Vpc(this, 'Vpc', {
            // Tip: The CIDR block should not overlap with any other VPC CIDR block (across AWS accounts or regions). This allows all VPCs to be connected if needed.
            // VPC CIDR blocks should not overlap with on-premises networks. This allows on-premises networks to be connected to AWS VPCs.
            // When you create a VPC, we recommend that you specify a CIDR block from the private IPv4 address ranges as specified in RFC 1918.
            // You cannot increase or decrease the size of an existing CIDR block.
            // Consider using AWS IPAM for large networks.
            // Mask /16 = 64k IP addresses.
            // 2^8 = 255 non-overlapping VPC CIDR blocks.
            cidr: `${cidr}/16`, // HostMin: 10.0.0.1. HostMax: 10.0.255.254. Hosts/Net: 2^16 = 65534. https://jodies.de/ipcalc
            // The default VPC has one subnet per availability zone (in that region).
            // Two availability zones is the minimum required for AZ redundancy. More AZs = more complexity.
            maxAzs: 2,
            // You can use a NAT gateway so that instances in a private subnet can connect to services outside your VPC e.g. the internet.
            // You are charged for each hour that your NAT gateway is available and each Gigabyte of data that it processes.
            natGateways: 0,
            // Subnets are created in each AZ. Two subnets * 2 AZs = 4 subnets.
            subnetConfiguration: [
                {
                    subnetType: ec2.SubnetType.PUBLIC,
                    name: 'public',
                    cidrMask: 20, // The default VPC uses this mask. Allows up to 4096-5=4091 useable IP address in each subnet.
                },
                {
                    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                    name: 'private',
                    cidrMask: 20, // The default VPC uses this mask. Allows up to 4096-5=4091 useable IP address in each subnet.
                }
            ],
            vpnGateway: true // Accept VPN connections.
        });

        // Add a tag to the VPC. Allows lookup of this VPC by tag.
        Tags.of(this.vpc).add('key', 'default');

        // internet gateway?

        // this.vpc.addVpnConnection('Dynamic', {
        //     ip: '1.2.3.4'
        // });

        // VPC endpoints ???

        // Client VPN endpoint ???
    }
}