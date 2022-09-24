# Security

Security is really important.

## Authentication

## Authorization

AppSync supports the following authorization types:
AWS_IAM: For using AWS Identity and Access Management (IAM) permissions.
AMAZON_COGNITO_USER_POOLS: For using an Amazon Cognito user pool.
API_KEY: For using API keys.
OPENID_CONNECT: For using your OpenID Connect provider.
AWS_LAMBDA: For using an AWS Lambda function.

By default, AppSync does NOT make the AppSync GraphQL API public.
AppSync supports endpoint, object, and field level authorization.

Configure AppSync to use a default authorization type and to support additional authorization types.
By default, Jompx defaults to using AWS_IAM as the default authorization type.

View active authorization types in AWS Management Console -> AppSync -> Settings.

AWS Documentation: https://docs.aws.amazon.com/appsync/latest/devguide/security-authz.html

TODO: Use or delete.
- AWS_IAM: GraphQL requests to include AWS Signature Version 4 authentication information. Associate Identity and IAM access policies.
- AMAZON_COGNITO_USER_POOLS: GraphQL request to include an OIDC token provided by Amazon Cognito User Pools. Use Cognito users and groups to control access.
- API_KEY: GraphQL request to include an AppSync key in the request header x-api-key.
- OPENID_CONNECT: GraphQL request to include a token provided by an OIDC-compliant service. OpenID providers include: Google, Apple, Microsoft (and others).
- AWS_LAMBDA: implement your own API authorization logic.

TODO: Use or delete.
public
private
owner
group

public
- key
- iam unauthorized role

private (i.e. authenticated)
- cognito
- iam authenticated role
- openid (oidc)

## Jompx Auth Directive

Jompx provides an auth directive for defining authorization rules on objects and fields. The directive is very similar to the AWS Amplify auth directive.

Important: In AppSync, any type that doesn't have an explicit directive defaults to the AppSync default authorization type. For example, if the default authentication type is IAM and 
no auth directives are assigned to any type then all types are accessible to IAM.

Jompx instead requires an auth rule on all schema types (fields are optional). It's more verbose, but makes auth more certain and prevents accidental security holes.

      TODO: Delete this. Jompx to enforce an auth rule across all objects. Why leave it to chance.
      By default, if no auth rules are applied to any object or field in the GraphyQL schema then AppSync gives the default authentication type access to all endpoints, objects, and fields. For example, if the default authentication type is AWS_IAM then a valid IAM request has access to any API endpoint and has access to all GraphQL objects and fields.

The Jompx auth directive uses standard AppSync authorization directives:
@aws_iam
@aws_cognito_user_pools
@aws_api_key
@aws_oidc
@aws_lambda

AWS Documentation: https://docs.aws.amazon.com/appsync/latest/devguide/security-authz.html

Example auth directive: When the following auth rules are applied to an object (or field), GraphQL endpoints, objects, and fields are only accessible by IAM or Cognito authenticated requests.

```
auth([
    { allow: 'private', provider: 'iam' }
    { allow: 'private', provider: 'userPools' }
]),
```

Only use providers for AppSync active authorization types.
For example, if provider is set to apiKey but AppSync is not configured to use AuthorizationType.API_KEY, then CDK synth will fail with error:
No Authorization Type API_KEY declared in GraphQL Api

## IAM
@aws_iam
Authorize IAM to access objects and fields.
Specify the type of access allowed in the IAM policy (using actions, resources, and condition keys).
API requests to have "AWS Signature Version 4" authentication information.

Jompx uses IAM as the default authorization type on AppSync.
Lambda functions will generally need permissions to call AppSync APIs and are given IAM permissions to do so.
Because IAM is the default, it means that all GraphQL objects and fields are protected using IAM.
i.e. It's not necessary to explicitly assign IAM permissions.
However, the default authorization can be changed and it's clearer to be explicit when defining security permissions.

Example 1: In the CDK, Give a Lambda function permissions to send queries to a specific AppSync resource.
```
myLambda.addToRolePolicy(new iam.PolicyStatement({
    actions: ['appsync:GraphQL'],
    resources: ['arn:${Partition}:appsync:${Region}:${Account}:apis/${GraphQLAPIId}/*']
}));
```

Example 2:
- The AppSync queries tool (in the AWS Management Console) has a authorization provider drop down.
- If IAM is the default authorization type then the queries tool has access to all objects/fields.
- TODO: If IAM is not the default authorization type and no IAM permission directives are specified in the schema then the queries tool does not have access to any objects/fields.

IAM actions, resources, and condition keys for AWS AppSync:
https://docs.aws.amazon.com/service-authorization/latest/reference/list_awsappsync.html

Example 3: Example IAM policy to grant permission to send a GraphQL query to a GraphQL API.
TODO: Attach to waht resource?
```
{
   "Version": "2012-10-17",
   "Statement": [
      {
         "Effect": "Allow",
         "Action": [
            "appsync:GraphQL"
         ],
         "Resource": [
            "arn:${Partition}:appsync:${Region}:${Account}:apis/${GraphQLAPIId}/*"
         ]
      }
   ]
}
```

## Cognito
@aws_cognito_user_pools
Do not use @aws_auth. You can't use the @aws_auth directive along with additional authorization modes.

Example 2:
- The AppSync queries tool (in the AWS Management Console) has a authorization provider drop down.
- When set to Cognito (and logged in), it allows access to all objects/fields with a cognito directive.
- If no cognito directives exist in the schema then queries will return an error. e.g.
```
{
  "data": {
    "mMovieFind": null
  },
  "errors": [
    {
      "path": [
        "mMovieFind"
      ],
      "data": null,
      "errorType": "Unauthorized",
      "errorInfo": null,
      "locations": [
        {
          "line": 2,
          "column": 3,
          "sourceName": null
        }
      ],
      "message": "Not Authorized to access mMovieFind on type Query"
    }
  ]
}
```

## Business

Call GraphQL with pass thru credentials or full iam credentials.

    @aws_api_key - To specify the field is API_KEY authorized.
    @aws_iam - To specify that the field is AWS_IAM authorized.
    @aws_oidc - To specify that the field is OPENID_CONNECT authorized.
    @aws_cognito_user_pools - To specify that the field is AMAZON_COGNITO_USER_POOLS authorized.
    @aws_lambda - To specify that the field is AWS_LAMBDA authorized.
