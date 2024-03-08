import * as cdk from 'aws-cdk-lib';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import { Config } from '@jompx-org/config';
import { Vpc } from '../constructs/vpc-network-construct';
import * as jompx from '@jompx/constructs';

/**
 * Important: Do not tightly couple the vpc object across stacks. Instead use a vpc lookup by tag.
 * 
 * It's easy to create a VPC. It's harder to plan and create a network for an organization. Do some homework before implementing!
 * This Jompx example is appropriate for a small organization that needs one non-overlapping VPC per AWS account/region and up to 256 VPCs.
 * AWS Region > VPC > Availability Zone > Subnet (private or public) > e.g. EC2.
 * e.g. AWS account1 CIDR: 10.0.0.0, AWS account2 CIDR: 10.1.0.0, AWS account3 CIDR: 10.2.0.0, AWS accountN CIDR: 10.255.0.0
 * Mask /16 = 64k IP addresses.
 * 2^8 = 255 non-overlapping VPC CIDR blocks.
 *
 * https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html
 * When you create a VPC, we recommend that you specify a CIDR block from the private IPv4 address ranges as specified in RFC 1918.
 * 10.0.0.0 - 10.255.255.255 (10/8 prefix) e.g. 10.0.0.0/16.
 * 172.16.0.0 - 172.31.255.255 (172.16/12 prefix) e.g. 172.31.0.0/16.
 * 192.168.0.0 - 192.168.255.255 (192.168/16 prefix) e.g. 192.168.0.0/20
 * 
 * Tips:
 * - The CIDR block should not overlap with any other VPC CIDR block (across AWS accounts or regions). This allows all VPCs to be connected if needed.
 * - VPC CIDR blocks should not overlap with on-premises networks. This allows on-premises networks to be connected to AWS VPCs.
 * - You cannot increase or decrease the size of an existing CIDR block.
 * - Consider using AWS IPAM for large networks.
 */
export class NetworkStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const config = new Config(this.node);
        const environment = config.environmentById(props?.env?.account);

        if (environment?.cidrBlock) {
            // Create default VPC.
            const vpcConstruct = new Vpc(this, 'Vpc', { cidrBlock: environment.cidrBlock });

            // Create Client VPN.
            const clientVpnConfig = config.value.clientVpns.find(o => o.name === `vpn-${this.region}-developer`)
            if (clientVpnConfig) {
                new jompx.ClientVpnSso(this, 'ClientVpn', {
                    accountId: this.account,
                    cidr: clientVpnConfig.cidr,
                    dnsServers: clientVpnConfig.dnsServers,
                    vpc: vpcConstruct.vpc,
                    vpcSubnets: vpcConstruct.vpc.selectSubnets({
                        subnetGroupName: 'client-vpn'
                    }),
                    samlProviderName: clientVpnConfig.samlProviderName,
                    rootDomainName: config.value.domains[0].rootDomainName,
                    logRetentionDays: logs.RetentionDays.ONE_WEEK,
                    splitTunnel: true // If true, only traffic intended for the VPC will traverse the VPN tunnel.
                })
            }
        }
    }
}