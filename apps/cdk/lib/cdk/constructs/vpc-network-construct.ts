import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { Tags } from 'aws-cdk-lib';

export interface VpcProps {
    cidrBlock: string;
    cidrPrefixLength?: number;
    /**
     * Allows lookup of this VPC by tag.
     */
    key?: string;
}

/**
 * This VPC is designed to be deployed to the network AWS account only.
 * Manually delete the default VPC that is provided by default in new AWS accounts.
 * Using a CDK managed VPC is preferrable because IAC can be used to manage VPC setup and configuration.
 * Difference between the custom default VPC:
 * - 
 */
export class Vpc extends Construct {

    public vpc: ec2.Vpc;

    constructor(scope: Construct, id: string, props: VpcProps) {
        super(scope, id);

        const defaultCidrPrefixLength = 16;

        // Property defaults.
        const cidrPrefixLength = defaultCidrPrefixLength ?? props.cidrPrefixLength;
        const key = props.key ?? 'default';
       
        this.vpc = new ec2.Vpc(this, 'Vpc', {
            // VPC CIDR blocks should not overlap with on-premises networks. This allows on-premises networks to be connected to AWS VPCs.
            // You cannot increase or decrease the size of an existing CIDR block.
            // Mask /16 = 64k IP addresses.
            // 2^8 = 255 non-overlapping VPC CIDR blocks.
            ipAddresses: ec2.IpAddresses.cidr(`${props.cidrBlock}/${cidrPrefixLength}`),// HostMin: 10.0.0.1. HostMax: 10.0.255.254. Hosts/Net: 2^16 = 65534. https://jodies.de/ipcalc
            // The default VPC has one subnet per availability zone (in that region).
            // Two availability zones is the minimum required for AZ redundancy. More AZs = more complexity.
            maxAzs: 2,
            // You can use a NAT gateway so that instances in a private subnet can connect to services outside your VPC e.g. the internet.
            // You are charged for each hour that your NAT gateway is available and each Gigabyte of data that it processes.
            natGateways: 0,
            // Subnets are created in each AZ. Two subnets * 2 AZs = 4 subnets.
            subnetConfiguration: [
                // Has access to the internet. Can be accessed from the internet.
                {
                    subnetType: ec2.SubnetType.PUBLIC,
                    name: 'public',
                    cidrMask: 20, // The default VPC uses this mask. Allows up to 4096-5=4091 useable IP address in each subnet.
                },
                // Has access to the internet. Can NOT be accessed from the internet.
                {
                    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
                    name: 'private',
                    cidrMask: 20, // The default VPC uses this mask. Allows up to 4096-5=4091 useable IP address in each subnet.
                },
                // Does NOT have access to the internet. Can NOT be accessed from the internet.
                {
                    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                    name: 'isolated',
                    cidrMask: 20, // The default VPC uses this mask. Allows up to 4096-5=4091 useable IP address in each subnet.
                },
                // AWS best practice is to create dedicated subnets for client VPN access for: isolation, access control, traffic routing, scalability and management, compliance.
                {
                    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                    name: 'client-vpn',
                    cidrMask: 20, // The default VPC uses this mask. Allows up to 4096-5=4091 useable IP address in each subnet.
                }
            ],
            // Gateway VPC endpoints provide reliable connectivity to Amazon S3 and DynamoDB without requiring an internet gateway or a NAT device for your VPC.
            // TODO: Check routing table. See routing chapter: https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html
            gatewayEndpoints: {
                S3: {
                    service: ec2.GatewayVpcEndpointAwsService.S3
                },
                DYNAMODB: {
                    service: ec2.GatewayVpcEndpointAwsService.DYNAMODB
                }
            }
        });

        // Add a tag to the VPC. Allows lookup of this VPC by tag.
        Tags.of(this.vpc).add('key', key);
    }
}
