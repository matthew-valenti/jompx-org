# Setup

## Overview
Create your AWS account and install jompx.

## Steps

### 0. Install Dependencies
nodejs
npm
npm install -g npx

### Company Name
Decide on company name and domain name.

### 1. Password Manager
Considering using a password manager to securely store all your credentials. e.g. https://bitwarden.com/

### 2. Create Domain Name
If you don't already have a domain name, go ahead and purchase one from one of the many services e.g. https://www.namecheap.com/. You can also choose to purchase directly from AWS with Amazon Route 53 (but you'll need to create an AWS account first). 

### 3. Create Email Accounts
You'll need multiple email accounts (at least one unique email address for each AWS account we'll create). Consider using email aliases or plus addressing. e.g.
##### TODO:
- root@yourdomain.com
- admin@yourdomain.com
- production@yourdomain.com
- development@yourdomain.com
- test@yourdomain.com

An email address that is a distribution group, rather than an individual's email.

### 4. Create a Git Repository
Create a git repository for your organization or project. This repository will be a mono repo and will contain all organization or project code. e.g. https://github.com/

Why Monorepo? Atomic changes, Shared code, single set of dependencies.

### Create GitHub Personal Access Token
https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
Scopes: repo, admin:repo_hook

Manually ddd the token to AWS Secrets Manager:
Type: Other type of secret
Value: xxx
Secret Name: /cicd/github/token
*Keep all other defaults.

Programatically add to secrets manager (for each account):
```
aws secretsmanager create-secret --name "/cicd/github/token" --secret-string "REPLACE_WITH_MY_TOKEN" --profile jompx-sandbox1
```
**Keep naming consistent with ParameterStore i.e. start with / and use paths.

The CDK does not support CodeBuild GitHub credentials. Get the GitHub token from AWS Secrets Manager and run the following CLI command:
 https://docs.aws.amazon.com/cdk/api/latest/docs/aws-codebuild-readme.html
 ```
 aws codebuild import-source-credentials --region us-west-2 --server-type GITHUB --auth-type PERSONAL_ACCESS_TOKEN --token REPLACE_WITH_MY_TOKEN --profile jompx-sandbox1
 aws codebuild import-source-credentials --region us-west-2 --server-type GITHUB --auth-type PERSONAL_ACCESS_TOKEN --token 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 --profile jompx-cicd-test

 ```

### 5. Create Nx Workspace
https://nx.dev/l/r/getting-started/nx-setup
Install globally since this one package rules them all.

```
npm install -g nx // or use npx nx
npx create-nx-workspace
  // Workspace name: jompx-org
  // apps [an empty workspace with no plugins with a layout that works best for building apps]
  // Use Nx Cloud: Yes Faster builds, run details, GitHub integration. Learn more at https://nx.app
```

### 5.5 Upgrade Nx Workspace
https://nx.dev/using-nx/updating-nx
```
nx migrate latest OR nx migrate 13.10.3
// Inspect package.json to see if changes make sense. Manually adjust if needed.
npm install
// For big projects comment out and reorder items in: migrations.json (or run all for small projects).
nx migrate --run-migrations // Runs npm install if needed
// Test upgrade successful.
nx --version // If comand does nothing then run npm i again.
```

### 6. Create an AWS Account
Requires a credit card.
Create your "root" AWS account with root@ email address (or similar).
Account name mycompany-management. Can only be changed manually by root AWS account user.

### 7. Choose Your AWS Region(s)
Choose your AWS regions carefully. They can vary in price, latency, product selection, and number of availability zones.

### 8. Install a 2FA App
If you don't already have one, install a 2FA app (for protecting your AWS credentials). e.g. https://authy.com/ or https://bitwarden.com/

### 9. Secure Your AWS Account
Follow AWS security best practices for your root account:
- Enable MFA. Go to Your account > Security credentials > Multi-factor authentication (MFA).
- Lock away root user access keys (if applicable).

### 10. Enable Organizations
Organizations is a global service.

### 11. Enable SSO
check your selected region is correct. Enable SSO.
Change User portal URL. Can change one time only??? Lame.
Bookmark the start url. Use this to switch between AWS accounts: https://x-xxxxxxxxxx.awsapps.com/start

### 12. Create Admin User in SSO
This user will have elevated permissions. Use only for management tasks.

Create administrator group.
group name = administrator

Create an admin user (and add to administrator group).
user name = admin
user email = admin@

https://docs.aws.amazon.com/singlesignon/latest/userguide/how-to-register-device.html
Under users, select the admin user and the MFA devices tab and register an MFA device.

Give the admin group access to all AWS accounts in the organization:
Create a new AdministratorAccess permission set with policy AdministratorAccess.
In AWS accounts, select all accounts and click "Assign Users". Select the groups tab and choose administrator, select the AdministratorAccess permission set.

For each permission set, you can specify a session duration to control the length of time that a user can be signed in to an AWS account.
https://docs.aws.amazon.com/singlesignon/latest/userguide/howtosessionduration.html
Session duration = 12 hours (max)

Setup profile on local
https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html#sso-configure-profile-auto
e.g.
```
// .aws/config
[profile jompx-management]
sso_start_url = https://x-xxxxxxxxxx.awsapps.com/start
sso_region = us-west-2
sso_account_id = xxxxxxxxxxxx
sso_role_name = AdministratorAccess
region=us-west-2
output=json
```

### 12b. Create Developer Users/Groups in SSO

Developer users and groups can be setup with permissions to whatever is appropriate for your company.

Here's an example setup:
Senior Developers to have admin access to all accounts including production. This allows senior developers to manaage/troubleshoot across all accounts.
Developers to have admin access to their own sandbox account only and view only access across all other accounts. This allows developers experimenet with all AWS services in their own sandbox and have visibility into test and production accounts including the CI/CD process.

Predefined permission sets: https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_job-functions.html

Create predefined permission set:
ViewOnlyAccess
*Set session duration e.g. 12 hours max.

Create groups:
senior-developer
developer

Create a user for each developer and add each developer to the appripriate group above e.g.
user name = matthew
user email = matthew@jompx.com
*Use a naming convention suitable for your company.
**Add as much or as little user information as needed.

Developer should register an MFA device. TODO: Document steps.

Set account permissions for each group above:
1. Select accounts (to give access to).
2. Click assign users or groups.
3. Select the group
4. Select the permission set (AdministratorAccess or ViewOnlyAccess)

On developer computer update aws/.config to include a sandbox entry (and other accounts as needed) e.g.
```
[profile jompx-sandbox1]
sso_start_url = https://d-xxxxxxxxfa.awsapps.com/start
sso_region = us-west-2
sso_account_id = xxxxxxxxxxxx
sso_role_name = AdministratorAccess
region=us-west-2
output=json
```

### 13 Login as Admin User Using SSO
https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html#sso-using-profile
// Do we need this (and manually run credentials update): aws sso login --profile jompx-management
nx login cdk --profile jompx-management

### 15. Create Organization YAML
```
// npm install -g aws-organization-formation
// Can we install locally?
npm install --save-dev aws-organization-formation
```

org-formation init organization.yml --region us-west-2 --profile jompx-management
npx aws-organization-formation init organization.yml --region us-west-2 --profile jompx-management

```
AWSTemplateFormatVersion: '2010-09-09-OC'

Organization:
  MasterAccount:
    Type: OC::ORG::MasterAccount
    Properties:
      AccountName: My Domain Management
      AccountId: 'xxxxxxxxxxxx'
      RootEmail: root@yourdomain.com

  OrganizationRoot:
    Type: OC::ORG::OrganizationRoot
    Properties:
      DefaultOrganizationAccessRoleName: OrganizationAccountAccessRole
```

As you change your yaml and want to deploy additional organization choices
```
npx org-formation update organization.yml --profile jompx-management
npx org-formation create-change-set organization.yml --profile jompx-management
npx org-formation execute-change-set fbcf712f-ceba-4323-b92d-73ec0e139e81 --profile jompx-management
```

### 16. Add SCP to Restrict Regions
For additional security against attacks and human error restrict your AWS accounts to certain regions only.
Do not restrict global services: cloudfront, iam, route53, support.
e.g. https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_aws_deny-requested-region.html
There are some resources that can only be created in us-east-1 so we'll allow that region too.

Add a YAML entry:
```
  RestrictUnusedRegionsSCP:
    Type: OC::ORG::ServiceControlPolicy
    Properties:
      PolicyName: RestrictUnusedRegions
      Description: Restrict Unused regions
      PolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Sid: DenyUnsupportedRegions
            Effect: Deny
            NotAction:
              - 'cloudfront:*'
              - 'iam:*'
              - 'route53:*'
              - 'support:*'
            Resource: '*'
            Condition:
              StringNotEquals:
                'aws:RequestedRegion':
                  - us-east-1
                  - us-west-2
```
Set:
NotAction > RequestedRegion

### 17. Create Route53 Hosted Zones

https://theburningmonk.com/2021/05/how-to-manage-route53-hosted-zones-in-a-multi-account-environment/

Create Route53 hosted zones so we can access apps across accounts/domains e.g. admin.jompx.com, admin.sandbox1.jompx.com
Create a Route53 public hosted zone in AWS prod account for domain name. E.g. for domain name = jompx.com
Create a Route53 public hosted zone in any AWS account with a subdomain tag.  E.g. for subdomain name = sandbox1.jompx.com

Why? Centralized DNS and associated resources make it hard for developers to do experiement/development on DNS related resources.
e.g. As a developer I want to experiment with CloudFront caching. If DNS and CloudFront resources for my sandbox AWS account are on the prod AWS account -- I need prod access and risk breaking prod.

Org formation example template: https://github.com/org-formation/org-formation-cli/blob/master/examples/templates/subdomains.yml

Create apps\org-formation\subdomains.yml

- Set default region param DefaultOrganizationBindingRegion e.g. us-west-2
- Add subdomain tags to organization.yml. Do NOT add tags to prod account (which will use the domain NOT a subdomain).
- TODO: TTL Set low (e.g. 300) until confirmed good then set to high value (e.g. AWS recommends 172800 2 days) to reduce latency and cost: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-values-basic.html#rrsets-values-basic-ttl

Creates a CloudFormation stack. If creating multiple domains then use unique stack names e.g. HostedZoneMyDomain1, HostedZoneMyDomain2
```
npx org-formation print-stacks subdomains.yml --stack-name HostedZone --parameters domainName=jompx.com --profile jompx-management
npx org-formation update-stacks subdomains.yml --stack-name HostedZone --parameters domainName=jompx.com --profile jompx-management
```

### 18. Update Your Domain Nameservers

If your domain name is hosted with a third party (not AWS) then update your domain name servers.
Go to AWS prod account > Hosted zones > mydomain.com
Expand the Hosted zone details box to view your four name servers.
Update your third party name servers.
https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/GetInfoAboutHostedZone.html
e.g. NameCheap instructions https://www.namecheap.com/support/knowledgebase/article.aspx/10371/2208/how-do-i-link-my-domain-to-amazon-web-services/

### Create Email DNS Records

Setup Route53 email DNS and check email health: https://mxtoolbox.com/emailhealth

e.g. for namecheap:
https://www.namecheap.com/support/knowledgebase/article.aspx/1340/2176/namecheap-private-email-records-for-domains-with-thirdparty-dns/

DCKIM Record Lookup:
https://mxtoolbox.com/dkim.aspx
Use domain name = jompx.com:default (and leave selector empty).

DMARK
https://www.cloudflare.com/learning/dns/dns-records/dns-dmarc-record/
https://mxtoolbox.com/dmarc/details/what-is-a-dmarc-record

### Install AWS CLI
https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

### 18. Install AWS CDK

Do not install NPM package globally. https://docs.aws.amazon.com/cdk/v2/guide/work-with-cdk-typescript.html
```
npm install -D aws-cdk // Do not install globally. Install as dev dependency and use npx.
mkdir apps/cdk
cd apps/cdk
npx aws-cdk --version
npx aws-cdk init app --language typescript
```

// TODO Plugin to automate:
- Move all "dependencies" packages to root package.json (and match versions to Jompx constructs) e.g.
```
"dependencies": {
  "aws-cdk-lib": "2.12.0",
  "constructs": "^10.0.61",
  "source-map-support": "^0.5.16"
},
```
- Delete node_modules folder
- Rename tsconfig.json to tsconfig.cdk.json
- Edit tsconfig.cdk.json to extend nx tsconfig.base.json (so we can use friendly paths): e.g.
 ```
 {
    "extends": "../../tsconfig.base.json",
    "compilerOptions": {
 ```
- Add tsconfig.json that extends from tsconfig.cdk.json
```
{
  "extends": "./tsconfig.cdk.json",
  "compilerOptions": {
    "typeRoots": [
      "../../node_modules/@types"
    ],
    "outDir": "tsc.out" // Custom: Move transpiled ts files to dist directory.
  },
  "exclude": [
    "tsc.out",
    // "./tsc.out/**/*", // Custom: Exclude outDir destination directory.
  ]
}

```
- Add paths to ./tsconfig.base.json i.e.
- Then we can import using a friendly path: import my-stack.ts from '@cdk/lib/my-stack';
```
{
  "compilerOptions": {
    "paths": {
      "@cdk/*": ["apps/cdk/*"]
    }
 
*Unfortunately tsconfig path is overwritten when extended (in apps folder). Keep all paths in the root for simplicity.

The CDK doesn't currently support tsconfig paths. Make the following additional changes:
```
// 1. Install module.
npm install tsconfig-paths

// 2. In cdk.json add: -r tsconfig-paths/register e.g.
"app": "npx ts-node -r tsconfig-paths/register --prefer-ts-exts bin/cdk.ts",

// 3. In launch.json replace runtimeArgs with:
"runtimeArgs": [
  "-r",
  "${workspaceFolder}/node_modules/ts-node/register",
  "-r",
  "${workspaceFolder}/node_modules/tsconfig-paths/register"
],
```

```
- Create project.json. This is a poor man's plugin. But is a good example of the commands that we'll want the plugin to support.
- Create config.ts file.
- Add apps to /workspace.json e.g.
- Add .vscode/launch.json (for CDK and Jest debugging).
- For debugging: npm install --save-dev @types/jest (same version in CDK package.json).
```
{
  "version": 2,
  "projects": {
    "org-formation": "apps/org-formation",
    "cdk": "apps/cdk"
  }
}
```
- Add synth as cacheable peration in /nx.json e.g.
```
"cacheableOperations": [
  "build",
  "lint",
  "test",
  "e2e",
  "synth"
]
```
- Run in root folder: ```npm install @jompx/constructs```
- Run in root folder: ```npm install```

```
 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
```

```
nx run cdk:list

nx build cdk
// or
nx run cdk:build

nx synth cdk

npx aws-cdk --version
```

TODO: Automate this with an nx plugin.
Add to workspace.json
Add project.json
Add cdk.context.json (for config). 

Move the following to root package.json
Delete node_modules folder.
```
"devDependencies": {
  "@types/jest": "^26.0.10",
  "@types/node": "10.17.27", -- Use the latest version already in nx root package.json.
  "jest": "^26.4.2",
  "ts-jest": "^26.2.0",
  "aws-cdk": "2.8.0",
  "ts-node": "^9.0.0",
  "typescript": "~3.9.7" -- Use the latest version already in nx root package.json.
},
"dependencies": {
  "aws-cdk-lib": "2.8.0",
  "constructs": "^10.0.0",
  "source-map-support": "^0.5.16"
}
```

extends: https://david-barreto.com/infrastructure-as-code-with-aws-cdk/

Move to root
jest.config.js

Change apps\cdk\tsconfig.json
*We can also delete this so that it looks up the tree. https://www.typescriptlang.org/tsconfig#typeRoots
```
// from:
"typeRoots": [
  "./node_modules/@types"
]

// to:
"typeRoots": [
  "../../node_modules/@types"
]
```

Update jest config to run tests in lib folder: apps\cdk\jest.config.js. We will put test files side-by-side with source files.
```
// from:
roots: ['<rootDir>/test'],
// to:
roots: ['<rootDir>/lib'],

// TODO: Jest VSCode debug only works if we point it to CDK: "cwd": "${workspaceFolder}/apps/cdk",
```

### Workaround for Using SSO with CDK
https://www.npmjs.com/package/cdk-sso-sync
After sso login with aws sso login --profile <YOUR PROFILE NAME> just run cdk-sso-sync <YOUR PROFILE NAME> to be able to use CDK with the same profile (cdk deploy --profile <YOUR PROFILE NAME>)
```
npm install --save-dev cdk-sso-sync
aws sso login --profile jompx-management
npx cdk-sso-sync jompx-management

aws sso login --profile jompx-cicd-test
npx cdk-sso-sync jompx-cicd-test
// Simply creates credentials in .aws\credentials

aws sso login --profile jompx-sandbox1
npx cdk-sso-sync jompx-sandbox1
```

### Enable Billing Alerts
Enable AWS billing alarms to control your AWS budget.

Check "Receive Billing Alerts" here: https://console.aws.amazon.com/billing/home#/
https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html#turning_on_billing_metrics

You can also check "Receive Free Tier Usage Alerts" if you're trying to stay within free tier usage.

### Setup Billing Alerts

### Management Account Best Practices
https://docs.aws.amazon.com/organizations/latest/userguide/orgs_best-practices_mgmt-acct.html

### Boostrap CDK
ugh-nightmare can we have a jompx cli command that picks up from config?
Version can be found in parameter store variable: /cdk-bootstrap/xxxxxxxxx/version
Maybe this helps -- boostrap all accounts in one script: https://stackoverflow.com/questions/59206845/how-to-provide-multiple-account-credentials-to-cdk-bootstrap

Bootstrap all accounts (that the CDK will deploy to). Include the trust param to give the CICD accounts access to deploy to other accounts.
 ```
// https://docs.aws.amazon.com/cdk/v2/guide/cdk_pipeline.html
// Windows run in command prompt (not Powershell).
set CDK_NEW_BOOTSTRAP=1
npx cdk bootstrap aws://ACCOUNT-NUMBER/REGION --profile ADMIN-PROFILE ^
    --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess ^
    aws://ACCOUNT-ID/REGION

// cicd-test
set CDK_NEW_BOOTSTRAP=1 
npx cdk bootstrap aws://863054937555/us-west-2 --profile jompx-cicd-test ^
    --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess ^
    aws://863054937555/us-west-2

// prod
set CDK_NEW_BOOTSTRAP=1
npx cdk bootstrap aws://281660020318/us-west-2 --profile jompx-prod ^
    --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess ^
    --trust "863054937555, 896371249616" ^
    aws://281660020318/us-west-2

// test
set CDK_NEW_BOOTSTRAP=1
npx cdk bootstrap aws://706457422044/us-west-2 --profile jompx-test ^
    --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess ^
    --trust "863054937555, 896371249616" ^
    aws://706457422044/us-west-2

// sandbox1
set CDK_NEW_BOOTSTRAP=1
npx cdk bootstrap aws://066209653567/us-west-2 --profile jompx-sandbox1 ^
    --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess ^
    --trust "863054937555, 896371249616" ^
    aws://066209653567/us-west-2
```

For each account, add an SSM parameter accountName.
```
aws ssm put-parameter --name "accountName" --value "cicd-test" --type String --profile jompx-cicd-test
```

### CDK Custom Config
cdk.json and cdk.context.json is used by the CDK.
Use our own custom config.ts file.

### CI/CD

Cost: Necessary for cross account actions.
https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_codepipeline-readme.html
$1/month

If you intend to deploy and/or manage your own CI/CD capabilities in AWS or use AWS managed CI/CD services, we recommend that you use a set of production deployment accounts within the Deployments OU to house the CI/CD management capabilities.
https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/deployments-ou.html

Deploying to a different account and Region
https://aws.amazon.com/blogs/developer/cdk-pipelines-continuous-delivery-for-aws-cdk-applications/

Run boostrap on each account (that we will deploy to).  
TODO: Can we automate this? We may be able to do this across all accounts in one command.

npx cdk bootstrap --profile account2-profile --trust ACCOUNT1 --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess aws://ACCOUNT2/us-west-2
*--trust ACCOUNT1 to allow ACCOUNT1 to deploy into ACCOUNT2.

Create a connection to GitHub. This is the new AWS recommended way vs adding a GitHub token to AWS Secrets Manager.  
https://docs.aws.amazon.com/codepipeline/latest/userguide/connections-github.html
 ```
 // aws codestar-connections create-connection --provider-type GitHub --connection-name organization-name
 aws codestar-connections create-connection --provider-type GitHub --connection-name jompx --profile jompx-cicd-test
 // e.g. "ConnectionArn": "arn:aws:codestar-connections:us-west-2:863054937555:connection/38e739e3-ed21-4dbc-98f9-b97e40764d5b"
 ```

 Use the AWS console to complete the connection.
 https://docs.aws.amazon.com/dtconsole/latest/userguide/connections-update.html

You must deploy a pipeline manually once. After that, the pipeline will keep itself up to date from the source code repository, so make sure the code in the repo is the code you want deployed.

- Fail fast
- Feature switches
- Unit testing
- E2E testing
- hotfix vs feature same process/cadence
- sandbox testing
- test pass thru

### CDK Pipeline Stack
```
// Login cicd-test
nx login cdk --profile jompx-cicd-test
// Deploy to cicd-test
nx synth cdk --args="CdkPipelineStack --context stage=test --profile jompx-cicd-test"
nx deploy cdk --args="CdkPipelineStack --context stage=test --profile jompx-cicd-test"

// Login cicd-prod
nx login cdk --profile jompx-cicd-prod
// Deploy to cicd-prod
nx synth cdk --args="CdkPipelineStack --context stage=prod --profile jompx-cicd-prod"
nx deploy cdk --args="CdkPipelineStack --context stage=prod --profile jompx-cicd-prod"
```

### Upgrade CDK
Version change often.
```
// In package.json bump versions:
aws-cdk-lib
constructs
@aws-cdk/aws-appsync-alpha
aws-cdk
```

## Development

Install esbuild for fast bundling of Lambda code.
```
npm install --save-dev esbuild@0
```

```
// Manually deploy a stack to sandbox1:
nx login cdk --profile jompx-sandbox1
nx run cdk:list // Set local config stage = prod or test or sandbox1

---

// For temporary testing only (in test env). Delete stack after use.
nx synth cdk --args="CdkPipelineStack/DnsStage/DnsStack --context stage=test --profile jompx-test"
nx deploy cdk --args="CdkPipelineStack/DnsStage/DnsStack --context stage=test --profile jompx-test"

// Deploy DNS to prod only.
nx synth cdk --args="CdkPipelineStack/DnsStage/DnsStack --context stage=prod --profile jompx-prod"
nx deploy cdk --args="CdkPipelineStack/DnsStage/DnsStack --context stage=prod --profile jompx-prod"

---

nx synth cdk --args="CdkPipelineStack/AppStage/HostingStack --profile jompx-sandbox1"
nx deploy cdk --args="CdkPipelineStack/AppStage/HostingStack --profile jompx-sandbox1"
nx deploy cdk --args="CdkPipelineStack/AppStage/HostingStack --profile jompx-sandbox1 --hotswap"

nx synth cdk --args="CdkPipelineStack/AppStage/CognitoStack --profile jompx-sandbox1"
nx deploy cdk --args="CdkPipelineStack/AppStage/CognitoStack --profile jompx-sandbox1"
nx deploy cdk --args="CdkPipelineStack/AppStage/CognitoStack --profile jompx-sandbox1 --hotswap"

nx synth cdk --args="CdkPipelineStack/AppStage/AppSyncStack --profile jompx-sandbox1"
nx deploy cdk --args="CdkPipelineStack/AppStage/AppSyncStack --profile jompx-sandbox1"
nx deploy cdk --args="CdkPipelineStack/AppStage/AppSyncStack --profile jompx-sandbox1 --hotswap"

nx run cdk:graphql-schema
```

### CDK Watch & Hotswap
https://cdkworkshop.com/20-typescript/30-hello-cdk/300-cdk-watch.html

```
nx watch cdk --args="CdkPipelineStack/CdkAppStageSandbox/AppSyncStack --profile jompx-sandbox1"
```

## Cognito
Create a Cognito user for yourself in AWS console.
Assign a group?

## AppSync
- We don't want to use VTL. However, Jompx does use a small amount of VTL.
- Code First Schema.
- KISS. 
- A datasourc is simply a Lambda function that receives event params and returns json.
- A resolverField is a field whose data will come from an AppSync resolver (same or different Lambda datasource).

### Schema

isRequired means field cannot be null.

## Errors

Error:
  Stack:arn... is in UPDATE_ROLLBACK_FAILED state and can not be updated.
Resolution:
  In AWS console, go to CloudFormation, select stack and choose Continue update rollback, check resources to skip (if necessary).

## GraphQL Code Generator

```
npm install graphql
npm install -D @graphql-codegen/cli
<!-- npm install @graphql-codegen/typescript-operations -->
npm install @graphql-codegen/typescript
npx graphql-codegen --version

aws appsync get-introspection-schema --api-id sbs46htyprdyljweegoxeokhp4 --format JSON --include-directives matthew.json --profile jompx-sandbox1
https://github.com/aws/aws-sdk-js-v3/blob/main/clients/client-appsync/src/commands/GetIntrospectionSchemaCommand.ts

https://github.com/gjtorikian/graphql-docs
GraphiQL app
```

## AppSync Security

IAM is enabled by default.
IAM directive must be applied to all object types, mutations, and queries. Not input types.
AppSync Business construct Lambdas have appsync permissions.

Note that AppSync does not support unauthorized access. A request with no Authorization header is automatically denied.

A mutation Lambda has a policy statement allowing the Lambda to call actions: appsync:GraphQL
So I think aws4-axios uses the Lambda process.env AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.
So the Lambda acts as an IAM user with permissions to call GraphQL.
The @iam directive is not needed when we only have AppSync IAM permissions.
By default then, with IAM AppSync permissions turned on, a call using Insomnia will result in UnauthorizedException

## Unit Testing
```
cdk apps/cdk
npm run test graphql-query.test.ts
```

# Ionic/Angular
https://nxtend.dev/docs/ionic-angular/getting-started/
https://ionicframework.com/blog/ionic-angular-monorepos-with-nx/
```
npm install --save-dev @nxtend/ionic-angular

// Create app.
nx generate @nxtend/ionic-angular:application --name admin --template sidemenu
```

Root files changed:
```
.gitignore
.vscode/extensions.json
nx.json
package-lock.json
package.json
workspace.json
```

Root files new:
```
.eslintrc.json
jest.config.js
jest.preset.js
```

Nx Commands:
```
nx build admin
nx lint admin
nx serve admin
nx test admin
nx e2e admin-e2e
```

## Thoughts:
Explain constructs and levels where Jompx is very high level constructs.
AWS good: Large number of cloud and serverless resources covering most use cases.
bad: Steep learning curve and difficult to create a secure and low cognitive solution for rapid development.
Cost level in doco: green, orange, red.
What is a stage e.g. dev, test, prod, sandbox1. We can't use env because that means something special to the CDK so we use stage instead.
Explain ID type and use across all keys/primary keys. Caution: does ID work for custom mutations inputs?

I THINK WE WANT TO USE THIS ON THE CLIENT?
Interesting graphQL query generator with autocomplete etc.
Do we want native GraphQL which kind of a bummer or something like this which is custom?
Can it keep up with GraphQL changes?
https://github.com/babyfish-ct/graphql-ts-client