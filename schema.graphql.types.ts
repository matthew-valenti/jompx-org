import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AWSDate: any;
  AWSDateTime: any;
  AWSEmail: any;
  AWSIPAddress: any;
  AWSJSON: any;
  AWSPhone: any;
  AWSTime: any;
  AWSTimestamp: any;
  AWSURL: any;
};

export enum AuthOperation {
  DeleteMany = 'deleteMany',
  DeleteOne = 'deleteOne',
  Find = 'find',
  FindOne = 'findOne',
  InsertMany = 'insertMany',
  InsertOne = 'insertOne',
  UpdateMany = 'updateMany',
  UpdateOne = 'updateOne',
  UpsertMany = 'upsertMany',
  UpsertOne = 'upsertOne'
}

export enum AuthProvider {
  ApiKey = 'apiKey',
  Function = 'function',
  Iam = 'iam',
  Oidc = 'oidc',
  UserPools = 'userPools'
}

export type AuthRule = {
  allow: AuthStrategy;
  groupClaim?: InputMaybe<Scalars['String']>;
  groups?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  groupsField?: InputMaybe<Scalars['String']>;
  identityClaim?: InputMaybe<Scalars['String']>;
  operations?: InputMaybe<Array<InputMaybe<AuthOperation>>>;
  ownerField?: InputMaybe<Scalars['String']>;
  provider: AuthProvider;
};

export enum AuthStrategy {
  Custom = 'custom',
  Groups = 'groups',
  Owners = 'owners',
  Private = 'private',
  Public = 'public'
}

export type MActor = MNode & {
  __typename?: 'MActor';
  createdAt: Scalars['AWSDateTime'];
  createdBy: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  mMovieActors?: Maybe<Array<Maybe<MMovieActor>>>;
  name: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
  updatedBy: Scalars['AWSDateTime'];
};

export type MActorConnection = {
  __typename?: 'MActorConnection';
  edges?: Maybe<Array<Maybe<MActorEdge>>>;
  pageInfo: PageInfoOffset;
  totalCount?: Maybe<Scalars['Int']>;
};

export type MActorEdge = {
  __typename?: 'MActorEdge';
  node?: Maybe<MActor>;
};

export type MMovie = MNode & {
  __typename?: 'MMovie';
  createdAt: Scalars['AWSDateTime'];
  createdBy: Scalars['AWSDateTime'];
  exampleBoolean?: Maybe<Scalars['Boolean']>;
  exampleDate?: Maybe<Scalars['AWSDate']>;
  exampleDateTime?: Maybe<Scalars['AWSDateTime']>;
  exampleEmail?: Maybe<Scalars['AWSEmail']>;
  exampleFloat?: Maybe<Scalars['Float']>;
  exampleInt?: Maybe<Scalars['Int']>;
  exampleIpAddress?: Maybe<Scalars['AWSIPAddress']>;
  exampleJson?: Maybe<Scalars['AWSJSON']>;
  examplePhone?: Maybe<Scalars['AWSPhone']>;
  exampleSourceField?: Maybe<Scalars['String']>;
  exampleTime?: Maybe<Scalars['AWSTime']>;
  exampleTimestamp?: Maybe<Scalars['AWSTimestamp']>;
  exampleUrl?: Maybe<Scalars['AWSURL']>;
  id: Scalars['ID'];
  mMovieActors: Array<Maybe<MMovieActor>>;
  name: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
  updatedBy: Scalars['AWSDateTime'];
};

export type MMovieActor = MNode & {
  __typename?: 'MMovieActor';
  actorId: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  createdBy: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  mActor: MMovie;
  mMovie: MMovie;
  movieId: Scalars['ID'];
  updatedAt: Scalars['AWSDateTime'];
  updatedBy: Scalars['AWSDateTime'];
};

export type MMovieActorConnection = {
  __typename?: 'MMovieActorConnection';
  edges?: Maybe<Array<Maybe<MMovieActorEdge>>>;
  pageInfo: PageInfoOffset;
  totalCount?: Maybe<Scalars['Int']>;
};

export type MMovieActorEdge = {
  __typename?: 'MMovieActorEdge';
  node?: Maybe<MMovieActor>;
};

export type MMovieConnection = {
  __typename?: 'MMovieConnection';
  edges?: Maybe<Array<Maybe<MMovieEdge>>>;
  pageInfo: PageInfoOffset;
  totalCount?: Maybe<Scalars['Int']>;
};

export type MMovieEdge = {
  __typename?: 'MMovieEdge';
  node?: Maybe<MMovie>;
};

export type MNode = {
  createdAt: Scalars['AWSDateTime'];
  createdBy: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  updatedAt: Scalars['AWSDateTime'];
  updatedBy: Scalars['AWSDateTime'];
};

export type MPostFindExampleInput = {
  number1: Scalars['Int'];
};

export type MPostFindExampleOutput = {
  __typename?: 'MPostFindExampleOutput';
  id?: Maybe<Scalars['ID']>;
};

export type MPostQueryExampleInput = {
  number1: Scalars['Int'];
  test?: InputMaybe<MPostQueryExampleTestInput>;
};

export type MPostQueryExampleOutput = {
  __typename?: 'MPostQueryExampleOutput';
  id?: Maybe<Scalars['ID']>;
  test?: Maybe<MPostQueryExampleTestOutput>;
};

export type MPostQueryExampleTestInput = {
  number1: Scalars['Int'];
};

export type MPostQueryExampleTestOutput = {
  __typename?: 'MPostQueryExampleTestOutput';
  result1: Scalars['Int'];
  result2: Scalars['Int'];
  test?: Maybe<MPostQueryExampleTestTestOutput>;
};

export type MPostQueryExampleTestTestOutput = {
  __typename?: 'MPostQueryExampleTestTestOutput';
  result1: Scalars['Int'];
  result2: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  mPostFindExample?: Maybe<MPostFindExampleOutput>;
  mPostQueryExample?: Maybe<MPostQueryExampleOutput>;
};


export type MutationMPostFindExampleArgs = {
  input: MPostFindExampleInput;
};


export type MutationMPostQueryExampleArgs = {
  input: MPostQueryExampleInput;
};

export type PageInfoCursor = {
  __typename?: 'PageInfoCursor';
  endCursor: Scalars['String'];
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor: Scalars['String'];
};

export type PageInfoOffset = {
  __typename?: 'PageInfoOffset';
  limit: Scalars['Int'];
  skip: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  mActorFind?: Maybe<MActorConnection>;
  mMovieActorFind?: Maybe<MMovieActorConnection>;
  mMovieFind?: Maybe<MMovieConnection>;
};


export type QueryMActorFindArgs = {
  filter?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryMMovieActorFindArgs = {
  filter?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryMMovieFindArgs = {
  filter?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type MPostFindExampleMutationVariables = Exact<{
  input: MPostFindExampleInput;
}>;


export type MPostFindExampleMutation = { __typename?: 'Mutation', mPostFindExample?: { __typename?: 'MPostFindExampleOutput', id?: string | null } | null };

export type FindExampleMMovieConnectionFragment = { __typename?: 'MMovieConnection', edges?: Array<{ __typename?: 'MMovieEdge', node?: { __typename?: 'MMovie', id: string } | null } | null> | null };

export type MMovieFindQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type MMovieFindQuery = { __typename?: 'Query', mMovieFind?: { __typename?: 'MMovieConnection', edges?: Array<{ __typename?: 'MMovieEdge', node?: { __typename?: 'MMovie', id: string } | null } | null> | null } | null };

export const FindExampleMMovieConnectionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FindExampleMMovieConnection"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MMovieConnection"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<FindExampleMMovieConnectionFragment, unknown>;
export const MPostFindExampleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"mPostFindExample"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MPostFindExampleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mPostFindExample"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<MPostFindExampleMutation, MPostFindExampleMutationVariables>;
export const MMovieFindDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"mMovieFind"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mMovieFind"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MMovieFindQuery, MMovieFindQueryVariables>;