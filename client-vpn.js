// Remember to remove this from package.json:
// npm uninstall @aws-sdk/client-sso-admin

// Import required AWS SDK clients and commands for Node.js
const { SSOAdminClient, CreateApplicationCommand, DescribeApplicationCommand } = require("@aws-sdk/client-sso-admin");
const { fromIni } = require("@aws-sdk/credential-provider-ini");

// Set the AWS Region
const REGION = "us-west-2"; //e.g., "us-east-1"

// Replace 'your-sso-profile-name' with your actual AWS profile name used with `aws sso login`
const credentials = fromIni({ profile: 'jompx-management' });

// Create an SSO Admin client service object with the SSO profile credentials
const ssoAdminClient = new SSOAdminClient({ region: REGION, credentials });
// Create an SSO Admin client service object
// const ssoAdminClient = new SSOAdminClient({ region: REGION });

// Set the application ARN
// const applicationArn = 'arn:aws:sso::015117255009:application/ssoins-7907be90eedb9697/apl-6bf0b70c58312c29'; // Replace with your application ARN
// const params = {
//   ApplicationArn: applicationArn,
// };
// const run = async () => {
//   try {
//     const data = await ssoAdminClient.send(new DescribeApplicationCommand(params));
//     console.log("Application Described:", data);
//     return data;
//   } catch (error) {
//     console.error(error);
//   }
// };
/*
{
  '$metadata': {
    httpStatusCode: 200,
    requestId: 'b201cba4-fe74-4a3c-9f33-ff13794363db',
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  },
  ApplicationArn: 'arn:aws:sso::015117255009:application/ssoins-7907be90eedb9697/apl-6bf0b70c58312c29',
  ApplicationProviderArn: 'arn:aws:sso::aws:applicationProvider/custom-saml',
  CreatedDate: 2024-01-02T23:17:49.146Z,
  Description: 'Custom SAML 2.0 application',
  InstanceArn: 'arn:aws:sso:::instance/ssoins-7907be90eedb9697',
  Name: 'AWS Client VPN',
  PortalOptions: {
    SignInOptions: { Origin: 'IDENTITY_CENTER' },
    Visibility: 'ENABLED',
    Visible: true
  },
  Status: 'ENABLED'
}
*/

// Parameters for creating the application
const createApplicationParams = {
  Name: 'xxx', // The name of the application
  // Name: 'xxxAWS Client VPN', // The name of the application
  Description: 'xxxCustom SAML 2.0 application', // A description for the application
  InstanceArn: 'arn:aws:sso:::instance/ssoins-7907be90eedb9697', // The ARN of the IAM Identity Center instance
  ApplicationProviderArn: 'arn:aws:sso::aws:applicationProvider/custom-saml', // The ARN of the application provider
  PortalOptions: {
    SignInOptions: { Origin: 'IDENTITY_CENTER' },
    Visibility: 'ENABLED',
    Visible: true
  }
};

const run = async () => {
  try {
    const data = await ssoAdminClient.send(new CreateApplicationCommand(createApplicationParams));
    console.log("Application Created:", data);
  } catch (error) {
    console.error("Error creating the application:", error);
  }
};

run();
