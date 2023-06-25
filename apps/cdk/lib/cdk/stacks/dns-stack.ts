import * as cdk from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
import * as jompx from '@jompx/constructs';
import { Config } from '@jompx-org/config';

/**
 * CAUTION: Changing a record id param (after it's been deployed) will result in the record being deleted from Route53. This feels like a CDK bug.
 * To recover, remove the record code and then deploy. Put back the record code and then deploy again.
 */
export class DnsStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const config = new Config(this.node);

        const environment =  config.environmentById(props?.env?.account);
        if (!environment) return;

        // 1. Create NameCheap email DNS.
        // NameCheap doco: https://www.namecheap.com/support/knowledgebase/article.aspx/1340/2176/namecheap-private-email-records-for-domains-with-thirdparty-dns/

        // Lookup jompx.com public hosted zone (created by org-formation).
        const domainName = environment?.name === 'prod' ? 'jompx.com' : `${environment?.name}.jompx.com`;
        const zone = route53.PublicHostedZone.fromLookup(this, 'LookupHostedZone', { domainName });

        new route53.MxRecord(this, 'MxRecord1', {
            zone: zone,
            ttl: cdk.Duration.minutes(86400),
            values: [
                {
                    hostName: 'mx1.privateemail.com',
                    priority: 10
                },
                {
                    hostName: 'mx2.privateemail.com',
                    priority: 10
                }
            ],
        });

        // SPF. Use -all (instead of ~all) to improve email delivery (according to NameCheap support).
        new route53.TxtRecord(this, "TxtRecord1", {
            zone: zone,
            ttl: cdk.Duration.minutes(86400),
            values: ['v=spf1 include:spf.privateemail.com -all'],
        });

        new route53.CnameRecord(this, `CnameApiRecord1`, {
            zone: zone,
            ttl: cdk.Duration.minutes(86400),
            domainName: 'privateemail.com',
            recordName: 'mail'
        });
        new route53.CnameRecord(this, `CnameApiRecord2`, {
            zone: zone,
            ttl: cdk.Duration.minutes(86400),
            domainName: 'privateemail.com',
            recordName: 'autodiscover'
        });
        new route53.CnameRecord(this, `CnameApiRecord3`, {
            zone: zone,
            ttl: cdk.Duration.minutes(86400),
            domainName: 'privateemail.com',
            recordName: 'autoconfig'
        });

        new route53.SrvRecord(this, 'MySrvRecord1', {
            zone: zone,
            ttl: cdk.Duration.minutes(86400),
            values: [{
                hostName: 'privateemail.com',
                priority: 0,
                weight: 0,
                port: 443
            }],
            recordName: '_autodiscover'
        });

        // NameCheap DKIM record. Get the value from NameCheap email management page.
        // Record type: TXT
        // Host: default._domainkey.yourdomain.tld
        // Value: the string which begins with "v=DKIM1; k=rsa; p=MIIBIjANB..." (should be entered without brackets and quotes)
        // Copy/paste from NameCheap: default._domainkey IN TXT ("v=DKIM1;k=rsa;p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyPU9k501244Q/kkQ/xMpPaHBXULMvIq6l0cedSi4iswMXaVP80FoORPvx9IjCvDC8Ud7OwNAW5ZYxGFlwMU+08AmJ1z29rX9+vASQ2TOt15lLj4I+rbI0QW+ujYDxlXUTPj+HuHp17Iwg88IKPK4x6b3PmZl0JjFSdZmbz5zLPexhhZqZPIB+wLZWcalLJYcUufeGdPfZJ/l0ORZ6qAxwFBrA0bXhja2pZcFXpAmlcBpFll//WKru0dPUtBxUfyN0S3SPfUa3rgK4zIjMBX34yB+x+BueE/fQNi0bOnSSWqKszWd/qlHrulmUlhkRqZRMRDpeg3DH5hwaIZr652ySQIDAQAB");
        new route53.TxtRecord(this, "TxtRecord2", {
            zone: zone,
            ttl: cdk.Duration.minutes(86400),
            values: ['v=DKIM1;k=rsa;p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyPU9k501244Q/kkQ/xMpPaHBXULMvIq6l0cedSi4iswMXaVP80FoORPvx9IjCvDC8Ud7OwNAW5ZYxGFlwMU+08AmJ1z29rX9+vASQ2TOt15lLj4I+rbI0QW+ujYDxlXUTPj+HuHp17Iwg88IKPK4x6b3PmZl0JjFSdZmbz5zLPexhhZqZPIB+wLZWcalLJYcUufeGdPfZJ/l0ORZ6qAxwFBrA0bXhja2pZcFXpAmlcBpFll//WKru0dPUtBxUfyN0S3SPfUa3rgK4zIjMBX34yB+x+BueE/fQNi0bOnSSWqKszWd/qlHrulmUlhkRqZRMRDpeg3DH5hwaIZr652ySQIDAQAB'],
            recordName: 'default._domainkey'
        });

        // DMARC1. https://www.cloudflare.com/learning/dns/dns-records/dns-dmarc-record/
        // p=none	Take no action other than sending aggregate reports. This let’s you see which messages are failing DMARC and fix the problems. With reporting enabled, you will get reports from organizations all over the world, including all of the big mail providers like Google, Yahoo, and Hotmail.
        // p=quarantine	Once your DMARC compliance is high enough, you may direct receiving organizations mark messages failing DMARC as spam. You’re telling the world your SPF and DKIM deployment is very accurate and to be careful with any message that fail.
        // p=reject	Once you’re sure all of your important messages are passing DMARC, you may direct organizations to outright reject messages that fail. You’re telling the world your SPF and DKIM deployment is fully complete and up to date.
        new route53.TxtRecord(this, "TxtRecord3", {
            zone: zone,
            ttl: cdk.Duration.minutes(86400),
            values: ['v=DMARC1; p=reject; rua=mailto:admin@jompx.com;'],
            recordName: '_dmarc'
        });
    }
}