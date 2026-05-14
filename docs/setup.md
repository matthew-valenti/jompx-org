# Nx

Create new Nx workspace.

```
npx create-nx-workspace@latest test --preset="@jompx/nx-plugin@0.0.1" --nxCloud=skip
```

## Patch Nx

```
// 1.
npm install patch-package postinstall-postinstall --save-dev

// 2.
In package.json:
"scripts": {
  "postinstall": "patch-package"
}

// 3. create folder
patches/

// 4. add file
@nx+js+21.6.3.patch

// 5. npm i -- to install patch

// 6. unknown why patches don't always apply. check them with:
npx patch-package --verbose
```

# Nx Jompx Plugin

Create the jompx plugin.
`npx nx generate @jompx/nx-plugin:jompx --name=jompx`

# Nx Org-formation Plugin

Create the org-formation plugin.
`npx nx generate @jompx/nx-plugin:org-formation --name=org-formation`

Note: You run org formation from the management account but resources go to target accounts.
So always use profile: jompx-management

Create organization.yml.
`npx nx run org-formation:init --profile jompx-management`

Create root hosted zone and subdomains.
npx nx run org-formation:create-route53-subdomains --domainName learnsnax.com --profile jompx-management --dry-run
Copy name servers from root hosted zone to NameCheap.

Create ACM wildcard certificates in us-east-1.
npx nx run org-formation:create-acm-certificates --domainName learnsnax.com --hostedZoneId Z01816913H3N6EBLZ6FT0 --profile jompx-management --dry-run

# Nx CDK Plugin

Create the CDK plugin.
`npx nx generate @jompx/nx-plugin:cdk --name=infra`
`npm i esbuild` // TODO: Is this not included by default?

CDK Boostrap AWS Accounts
jompx-bootstrap:

- Enables the modern bootstrap stack v2+.
- For trust, uses default --cloudformation-execution-policies = arn:aws:iam::aws:policy/AdministratorAccess

```
npx nx run infra:bootstrap --accountId 547981474277 --region us-west-2 --profile learnsnax-matthew-cicd
npx nx run infra:bootstrap --accountId 659571592750 --region us-west-2 --trust 547981474277 --profile learnsnax-matthew-sandbox1
npx nx run infra:bootstrap --accountId 055694273351 --region us-west-2 --trust 547981474277 --profile learnsnax-matthew-prod
npx nx run infra:bootstrap --accountId 705242014501 --region us-west-2 --trust 547981474277 --profile learnsnax-matthew-network
npx nx run infra:bootstrap --accountId 705242014501 --region us-east-1 --trust 547981474277 --profile learnsnax-matthew-network
npx nx run infra:bootstrap --accountId 474876695139 --region us-west-2 --trust 547981474277 --profile learnsnax-matthew-security
```

# Nx Config Plugin (cjs/esm)

Create the plugin.
`npx nx generate @jompx/nx-plugin:config --name=config --importPath="@learnsnax/config"`

Create config schema: libs\config\src\lib\config.schema.ts
Create config values: libs\config\src\lib\config.yaml

npx nx gen config
npx nx build config

# Nx Catalog Plugin (cjs/esm)

Create the plugin.
`npx nx generate @jompx/nx-plugin:catalog --name=catalog --importPath="@learnsnax/catalog"`

Create catalog: libs\catalog\src\lib\catalog.ts
Install zod and create catalog validation rules: npm i zod

npx nx gen catalog
npx nx build catalog

# Nx Authorization Plugin (cjs/esm)

Create the plugin.
`npx nx generate @jompx/nx-plugin:authorization --name=authorization --importPath="@learnsnax/authorization"`

Create authorization cedar rules for coarse and fine grain access to GraphQL APIs.

npx nx gen authorization
npx nx build authorization

- Run gen to create cedar schema from catalog.
- Create organization level cedar rules e.g. Admin group can access all operations on all groups. libs\authorization\src\lib\global\org.cedar
- Create datasource level cedar rules: e.g. Editor group can manage their own data only. libs\authorization\src\lib\datasources\mysql\movie.cedar

# Nx JGraphQL Plugin (cjs/esm)

Create the plugin.
`npx nx generate @jompx/nx-plugin:jgraphql --name=jgraphql --importPath="@learnsnax/jgraphql"`

npx nx gen jgraphql --apiName api
npx nx codegen jgraphql
