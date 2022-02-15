# Setup

## Overview
Create your AWS account and install jompx.

## Steps

### 0. Install Dependencies
nodejs
npm
npm install -g npx

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
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

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
nx migrate latest
// Inspect package.json to see if changes make sense. Manually adjust if needed.
npm install
// For big projects comment out and reorder items in: migrations.json (or run all for small projects).
nx migrate --run-migrations
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
Create administrator group.
group name = administrator

Create an admin user (and add to administrator group).
user name = admin
user email = admin@

https://docs.aws.amazon.com/singlesignon/latest/userguide/how-to-register-device.html
Under users, select the admin user and the MFA devices tab and register an MFA device.

Give the admin user admin access to all AWS accounts in the organization.
Create a new AdministratorAccess permission set with policy AdministratorAccess.
In AWS accounts, select all accounts and click "Assign Users". Select the admin user, select the AdministratorAccess permission set.

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

### 13 Login as Admin User Using SSO
https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html#sso-using-profile
aws sso login --profile jompx-management

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
npx aws-organization-formation update organization.yml --profile jompx-management
npx aws-organization-formation create-change-set organization.yml --profile jompx-management
npx aws-organization-formation execute-change-set 9286bc64-36ce-4a14-ac06-977aed736d3d --profile jompx-management
```

### 16. Add SCP to Restrict Regions
For additional security against attacks and human error restrict your AWS accounts to certain regions only.

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
                  - us-west-2
```
Set:
NotAction
RequestedRegion

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
  "@types/node": "10.17.27",
  "jest": "^26.4.2",
  "ts-jest": "^26.2.0",
  "aws-cdk": "2.8.0",
  "ts-node": "^9.0.0",
  "typescript": "~3.9.7"
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

 Bootstrap an environment that can provision an AWS CDK pipeline.
 Bootstrap CI/CD test and prod accounts.
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
```

Bootstrap additional environments into which AWS CDK applications will be deployed by the pipeline
```
// Windows run in command prompt (not Powershell).
set CDK_NEW_BOOTSTRAP=1 
npx cdk bootstrap aws://ACCOUNT-NUMBER/REGION --profile ADMIN-PROFILE ^
    --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess ^
    --trust PIPELINE-ACCOUNT-ID ^
    aws://ACCOUNT-ID/REGION

// sandbox1
set CDK_NEW_BOOTSTRAP=1
npx cdk bootstrap aws://066209653567/us-west-2 --profile jompx-sandbox1 ^
    --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess ^
    --trust "863054937555, 896371249616" ^
    aws://066209653567/us-west-2
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

npx cdk bootstrap --profile account2-profile --trust ACCOUNT1 --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess aws://ACCOUNT2/us-west-2
*--trust ACCOUNT1 to allow ACCOUNT1 to deploy into ACCOUNT2.

pipeline.addStage(new CdkpipelinesDemoStage(this, 'Prod', {
    env: { account: 'ACCOUNT2', region: 'us-west-2' }
}));

```
nx login cdk --profile jompx-cicd-test
nx synth cdk --args="CdkPipelineStack --profile jompx-cicd-test"

npx aws-cdk synth CdkPipelineStack --profile jompx-cicd-test

// We want to do this but: Error terminal (TTY) is not attached so we are unable to get a confirmation from the user
nx deploy cdk --profile jompx-cicd-test
nx deploy cdk --args="CdkPipelineStack --profile jompx-cicd-test"

npx -p aws-cdk cdk deploy --profile jompx-cicd-test // Does NOT work because prompts for user confirmation i.e. --require-approval. Posted to nx slack support.
npx aws-cdk deploy CdkPipelineStack --profile jompx-cicd-test
```
