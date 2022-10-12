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
  UserPool = 'userPool'
}

export type AuthRule = {
  allow: AuthStrategy;
  groupClaim?: InputMaybe<Scalars['String']>;
  groups?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  groupsField?: InputMaybe<Scalars['String']>;
  operations?: InputMaybe<Array<InputMaybe<AuthOperation>>>;
  ownerClaim?: InputMaybe<Scalars['String']>;
  ownersField?: InputMaybe<Scalars['String']>;
  provider: AuthProvider;
};

export enum AuthStrategy {
  Custom = 'custom',
  Groups = 'groups',
  Owners = 'owners',
  Private = 'private',
  Public = 'public'
}

export type DActor = DNode & {
  __typename?: 'DActor';
  createdAt: Scalars['AWSDateTime'];
  createdBy: Scalars['AWSDateTime'];
  dMovieActors?: Maybe<Array<Maybe<DMovieActor>>>;
  id: Scalars['ID'];
  name: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
  updatedBy: Scalars['AWSDateTime'];
};

export type DActorConnection = {
  __typename?: 'DActorConnection';
  edges?: Maybe<Array<Maybe<DActorEdge>>>;
  pageInfo: PageInfoOffset;
  totalCount?: Maybe<Scalars['Int']>;
};

export type DActorEdge = {
  __typename?: 'DActorEdge';
  node?: Maybe<DActor>;
};

export type DActorProps = {
  consistentRead?: InputMaybe<Scalars['Boolean']>;
  returnConsumedCapacity?: InputMaybe<Scalars['Boolean']>;
};

export type DMovie = DNode & {
  __typename?: 'DMovie';
  boolean?: Maybe<Scalars['Boolean']>;
  createdAt: Scalars['AWSDateTime'];
  createdBy: Scalars['AWSDateTime'];
  dMovieActors: Array<Maybe<DMovieActor>>;
  date?: Maybe<Scalars['AWSDate']>;
  dateTime?: Maybe<Scalars['AWSDateTime']>;
  decimal?: Maybe<Scalars['Float']>;
  email?: Maybe<Scalars['AWSEmail']>;
  float?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  int?: Maybe<Scalars['Int']>;
  ipAddress?: Maybe<Scalars['AWSIPAddress']>;
  json?: Maybe<Scalars['AWSJSON']>;
  name: Scalars['String'];
  phone?: Maybe<Scalars['AWSPhone']>;
  sourceField?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['AWSTime']>;
  timestamp?: Maybe<Scalars['AWSTimestamp']>;
  updatedAt: Scalars['AWSDateTime'];
  updatedBy: Scalars['AWSDateTime'];
  url?: Maybe<Scalars['AWSURL']>;
};

export type DMovieActor = DNode & {
  __typename?: 'DMovieActor';
  actorId: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  createdBy: Scalars['AWSDateTime'];
  dActor: DMovie;
  dMovie: DMovie;
  id: Scalars['ID'];
  movieId: Scalars['ID'];
  updatedAt: Scalars['AWSDateTime'];
  updatedBy: Scalars['AWSDateTime'];
};

export type DMovieActorConnection = {
  __typename?: 'DMovieActorConnection';
  edges?: Maybe<Array<Maybe<DMovieActorEdge>>>;
  pageInfo: PageInfoOffset;
  totalCount?: Maybe<Scalars['Int']>;
};

export type DMovieActorEdge = {
  __typename?: 'DMovieActorEdge';
  node?: Maybe<DMovieActor>;
};

export type DMovieActorProps = {
  consistentRead?: InputMaybe<Scalars['Boolean']>;
  returnConsumedCapacity?: InputMaybe<Scalars['Boolean']>;
};

export type DMovieIndex = DNode & {
  __typename?: 'DMovieIndex';
  createdAt: Scalars['AWSDateTime'];
  createdBy: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
  updatedBy: Scalars['AWSDateTime'];
  url?: Maybe<Scalars['AWSURL']>;
};

export type DMovieProps = {
  consistentRead?: InputMaybe<Scalars['Boolean']>;
  returnConsumedCapacity?: InputMaybe<Scalars['Boolean']>;
};

export type DNode = {
  createdAt: Scalars['AWSDateTime'];
  createdBy: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  updatedAt: Scalars['AWSDateTime'];
  updatedBy: Scalars['AWSDateTime'];
};

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

export type MActorProps = {
  consistentRead?: InputMaybe<Scalars['Boolean']>;
  returnConsumedCapacity?: InputMaybe<Scalars['Boolean']>;
};

export type MMovie = MNode & {
  __typename?: 'MMovie';
  boolean?: Maybe<Scalars['Boolean']>;
  createdAt: Scalars['AWSDateTime'];
  createdBy: Scalars['AWSDateTime'];
  date?: Maybe<Scalars['AWSDate']>;
  dateTime?: Maybe<Scalars['AWSDateTime']>;
  email?: Maybe<Scalars['AWSEmail']>;
  float?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  int?: Maybe<Scalars['Int']>;
  ipAddress?: Maybe<Scalars['AWSIPAddress']>;
  json?: Maybe<Scalars['AWSJSON']>;
  mMovieActors: Array<Maybe<MMovieActor>>;
  name: Scalars['String'];
  phone?: Maybe<Scalars['AWSPhone']>;
  sourceField?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['AWSTime']>;
  timestamp?: Maybe<Scalars['AWSTimestamp']>;
  updatedAt: Scalars['AWSDateTime'];
  updatedBy: Scalars['AWSDateTime'];
  url?: Maybe<Scalars['AWSURL']>;
};

export type MMovieActor = MNode & {
  __typename?: 'MMovieActor';
  actorId: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  createdBy: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  mActor: MActor;
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

export type MMovieActorProps = {
  consistentRead?: InputMaybe<Scalars['Boolean']>;
  returnConsumedCapacity?: InputMaybe<Scalars['Boolean']>;
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

export type MMovieProps = {
  consistentRead?: InputMaybe<Scalars['Boolean']>;
  returnConsumedCapacity?: InputMaybe<Scalars['Boolean']>;
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
  dActorFind?: Maybe<DActorConnection>;
  dActorFindOne?: Maybe<DActor>;
  dMovieActorFind?: Maybe<DMovieActorConnection>;
  dMovieActorFindOne?: Maybe<DMovieActor>;
  dMovieFindOne?: Maybe<DMovie>;
  mActorFind?: Maybe<MActorConnection>;
  mActorFindOne?: Maybe<MActor>;
  mMovieActorFind?: Maybe<MMovieActorConnection>;
  mMovieActorFindOne?: Maybe<MMovieActor>;
  mMovieFind?: Maybe<MMovieConnection>;
  mMovieFindOne?: Maybe<MMovie>;
};


export type QueryDActorFindArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['AWSJSON']>;
};


export type QueryDActorFindOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  props?: InputMaybe<DActorProps>;
};


export type QueryDMovieActorFindArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['AWSJSON']>;
};


export type QueryDMovieActorFindOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  props?: InputMaybe<DMovieActorProps>;
};


export type QueryDMovieFindOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  props?: InputMaybe<DMovieProps>;
};


export type QueryMActorFindArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['AWSJSON']>;
};


export type QueryMActorFindOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  props?: InputMaybe<MActorProps>;
};


export type QueryMMovieActorFindArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['AWSJSON']>;
};


export type QueryMMovieActorFindOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  props?: InputMaybe<MMovieActorProps>;
};


export type QueryMMovieFindArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['AWSJSON']>;
};


export type QueryMMovieFindOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  props?: InputMaybe<MMovieProps>;
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