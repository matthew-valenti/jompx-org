import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { Tags } from 'aws-cdk-lib';
import { Config } from '@jompx-org/config';

export class NetworkStack extends cdk.Stack {

    // Do not allow other stacks to use the network stack as a hard dependency.
    // public vpc: ec2.Vpc;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const config = new Config(this.node);
        const environment = config.environmentById(props?.env?.account);

        const cidr = environment?.cidr; // e.g. '10.1.0.0';
        if (!cidr) return;
        console.log('cidr', cidr);

        // Important: It's easy to create a VPC. It can be hard to create a network for an organization. Do some homework before implementing!
        // This Jompx example is appropriate for a small organization that needs one non-overlapping VPC per AWS account/region and up to 256 VPCs.
        // AWS Region > VPC > Availability Zone > Subnet (private or public) > e.g. EC2.
        // e.g. AWS account1 CIDR: 10.0.0.0, AWS account2 CIDR: 10.1.0.0, AWS account3 CIDR: 10.2.0.0, AWS accountN CIDR: 10.255.0.0
        // https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html
        // When you create a VPC, we recommend that you specify a CIDR block from the private IPv4 address ranges as specified in RFC 1918.
        // 10.0.0.0 - 10.255.255.255 (10/8 prefix) e.g. 10.0.0.0/16.
        // 172.16.0.0 - 172.31.255.255 (172.16/12 prefix) e.g. 172.31.0.0/16.
        // 192.168.0.0 - 192.168.255.255 (192.168/16 prefix) e.g. 192.168.0.0/20
        const vpc = new ec2.Vpc(this, 'Vpc', {
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
            },
            vpnGateway: true, // Accept VPN connections.
        });

        // Add a tag to the VPC. Allows lookup of this VPC by tag.
        Tags.of(vpc).add('key', 'default');

        // internet gateway?

        // AWS Client VPN.
        // Allow local client/computer to connect to the VPC (and resources in the VPC).
        // Local > Open VPN > Public Internet > VPN Endpoint > Client VPN network interface in subnet.

        // // Security Group for the Client VPN - Replace with your security group IDs
        // const vpnSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(this, 'VpnSecurityGroup', 'sg-0123456789abcdef0');

        // // Define the Client VPN Endpoint
        // const clientVpnEndpoint = new ec2.CfnClientVpnEndpoint(this, 'ClientVpnEndpoint', {
        //     description: 'AWS Client VPN',
        //     authenticationOptions: [{
        //         type: 'federated-authentication',
        //         federatedAuthentication: {
        //             samlProviderArn: 'arn:aws:iam::00112233445566:saml-provider/SSOVPN'
        //         }
        //     }],
        //     clientCidrBlock: '192.168.0.0/22',
        //     connectionLogOptions: {
        //         enabled: false
        //     },
        //     serverCertificateArn: 'arn:aws:acm:region:account:certificate/certificate-id', // Replace with your ACM certificate ARN
        //     splitTunnel: true,
        //     vpcId: vpc.vpcId,
        //     securityGroupIds: [vpnSecurityGroup.securityGroupId],
        //     transportProtocol: 'udp',
        //     vpnPort: 443,
        //     dnsServers: ['1.1.1.1', '1.0.0.1'] // Replace with your DNS servers
        // });

        // I think this is wrong? Where did this thinking come from. Don't we want a "Client VPN"?

        // vpc.addVpnConnection('Dynamic', {
        //     ip: '1.2.3.4'
        // });


        // // Create VPN Gateway
        // const vpnGateway = new ec2.CfnVPNGateway(this, 'VpnGateway', {
        //     type: 'ipsec.1',
        // });

        // // Attach VPN Gateway to VPC
        // new ec2.CfnVPCGatewayAttachment(this, 'VpcGatewayAttachment', {
        //     vpcId: vpc.vpcId,
        //     vpnGatewayId: vpnGateway.ref,
        // });

        // // Define Customer Gateway IP and BGP ASN (replace with your local network's public IP and BGP ASN)
        // const customerGatewayIp = 'your-customer-gateway-public-ip';
        // const bgpAsn = 65000;

        // // Create Customer Gateway
        // const customerGateway = new ec2.CfnCustomerGateway(this, 'CustomerGateway', {
        //     bgpAsn: bgpAsn,
        //     ipAddress: customerGatewayIp,
        //     type: 'ipsec.1',
        // });

        // // Create VPN Connection
        // new ec2.CfnVPNConnection(this, 'VpnConnection', {
        //     customerGatewayId: customerGateway.ref,
        //     vpnGatewayId: vpnGateway.ref,
        //     type: 'ipsec.1',
        //     staticRoutesOnly: true, // Set to false if you want BGP dynamic routing
        // });
    }
}