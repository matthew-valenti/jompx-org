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
  FindCursor = 'findCursor',
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
  createdAt?: Maybe<Scalars['AWSDateTime']>;
  createdBy?: Maybe<Scalars['AWSDateTime']>;
  dMovieActors?: Maybe<Array<Maybe<DMovieActor>>>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['AWSDateTime']>;
  updatedBy?: Maybe<Scalars['AWSDateTime']>;
};

export type DActorCursorConnection = {
  __typename?: 'DActorCursorConnection';
  edges?: Maybe<Array<Maybe<DActorCursorEdge>>>;
  pageInfo: PageInfoCursor;
  totalCount?: Maybe<Scalars['Int']>;
};

export type DActorCursorEdge = {
  __typename?: 'DActorCursorEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<DActor>;
};

export type DActorInput = {
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  createdBy?: InputMaybe<Scalars['AWSDateTime']>;
  id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['AWSDateTime']>;
  updatedBy?: InputMaybe<Scalars['AWSDateTime']>;
};

export type DMovie = DNode & {
  __typename?: 'DMovie';
  attributes?: Maybe<DMovieAttributes>;
  boolean?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['AWSDateTime']>;
  createdBy?: Maybe<Scalars['AWSDateTime']>;
  dMovieActors: Array<Maybe<DMovieActor>>;
  date?: Maybe<Scalars['AWSDate']>;
  dateTime?: Maybe<Scalars['AWSDateTime']>;
  decimal?: Maybe<Scalars['Float']>;
  email?: Maybe<Scalars['AWSEmail']>;
  float?: Maybe<Scalars['Float']>;
  groups?: Maybe<Array<Maybe<Scalars['String']>>>;
  id?: Maybe<Scalars['ID']>;
  int?: Maybe<Scalars['Int']>;
  ipAddress?: Maybe<Scalars['AWSIPAddress']>;
  list?: Maybe<Array<Maybe<Scalars['String']>>>;
  name?: Maybe<Scalars['String']>;
  owners?: Maybe<Array<Maybe<Scalars['String']>>>;
  phone?: Maybe<Scalars['AWSPhone']>;
  sourceField?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['AWSTime']>;
  timestamp?: Maybe<Scalars['AWSTimestamp']>;
  updatedAt?: Maybe<Scalars['AWSDateTime']>;
  updatedBy?: Maybe<Scalars['AWSDateTime']>;
  url?: Maybe<Scalars['AWSURL']>;
};

export type DMovieActor = DNode & {
  __typename?: 'DMovieActor';
  actorId?: Maybe<Scalars['ID']>;
  createdAt?: Maybe<Scalars['AWSDateTime']>;
  createdBy?: Maybe<Scalars['AWSDateTime']>;
  dActor?: Maybe<DActor>;
  dMovie?: Maybe<DMovie>;
  id?: Maybe<Scalars['ID']>;
  movieId?: Maybe<Scalars['ID']>;
  updatedAt?: Maybe<Scalars['AWSDateTime']>;
  updatedBy?: Maybe<Scalars['AWSDateTime']>;
};

export type DMovieActorCursorConnection = {
  __typename?: 'DMovieActorCursorConnection';
  edges?: Maybe<Array<Maybe<DMovieActorCursorEdge>>>;
  pageInfo: PageInfoCursor;
  totalCount?: Maybe<Scalars['Int']>;
};

export type DMovieActorCursorEdge = {
  __typename?: 'DMovieActorCursorEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<DMovieActor>;
};

export type DMovieActorInput = {
  actorId?: InputMaybe<Scalars['ID']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  createdBy?: InputMaybe<Scalars['AWSDateTime']>;
  id?: InputMaybe<Scalars['ID']>;
  movieId?: InputMaybe<Scalars['ID']>;
  updatedAt?: InputMaybe<Scalars['AWSDateTime']>;
  updatedBy?: InputMaybe<Scalars['AWSDateTime']>;
};

export type DMovieAttributes = {
  __typename?: 'DMovieAttributes';
  attribute1?: Maybe<Scalars['String']>;
  attribute2?: Maybe<Scalars['String']>;
  attribute3?: Maybe<Scalars['Int']>;
  attribute4?: Maybe<Array<Maybe<Scalars['String']>>>;
  attribute5?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type DMovieAttributesInput = {
  attribute1?: InputMaybe<Scalars['String']>;
  attribute2?: InputMaybe<Scalars['String']>;
  attribute3?: InputMaybe<Scalars['Int']>;
  attribute4?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  attribute5?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type DMovieCursorConnection = {
  __typename?: 'DMovieCursorConnection';
  edges?: Maybe<Array<Maybe<DMovieCursorEdge>>>;
  pageInfo: PageInfoCursor;
  totalCount?: Maybe<Scalars['Int']>;
};

export type DMovieCursorEdge = {
  __typename?: 'DMovieCursorEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<DMovie>;
};

export type DMovieIndex = DNode & {
  __typename?: 'DMovieIndex';
  createdAt?: Maybe<Scalars['AWSDateTime']>;
  createdBy?: Maybe<Scalars['AWSDateTime']>;
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  updatedAt?: Maybe<Scalars['AWSDateTime']>;
  updatedBy?: Maybe<Scalars['AWSDateTime']>;
};

export type DMovieIndexCursorConnection = {
  __typename?: 'DMovieIndexCursorConnection';
  edges?: Maybe<Array<Maybe<DMovieIndexCursorEdge>>>;
  pageInfo: PageInfoCursor;
  totalCount?: Maybe<Scalars['Int']>;
};

export type DMovieIndexCursorEdge = {
  __typename?: 'DMovieIndexCursorEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<DMovieIndex>;
};

export type DMovieInput = {
  attributes?: InputMaybe<DMovieAttributesInput>;
  boolean?: InputMaybe<Scalars['Boolean']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  createdBy?: InputMaybe<Scalars['AWSDateTime']>;
  date?: InputMaybe<Scalars['AWSDate']>;
  dateTime?: InputMaybe<Scalars['AWSDateTime']>;
  decimal?: InputMaybe<Scalars['Float']>;
  email?: InputMaybe<Scalars['AWSEmail']>;
  float?: InputMaybe<Scalars['Float']>;
  groups?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  id?: InputMaybe<Scalars['ID']>;
  int?: InputMaybe<Scalars['Int']>;
  ipAddress?: InputMaybe<Scalars['AWSIPAddress']>;
  list?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name?: InputMaybe<Scalars['String']>;
  owners?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  phone?: InputMaybe<Scalars['AWSPhone']>;
  sourceField?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['AWSTime']>;
  timestamp?: InputMaybe<Scalars['AWSTimestamp']>;
  updatedAt?: InputMaybe<Scalars['AWSDateTime']>;
  updatedBy?: InputMaybe<Scalars['AWSDateTime']>;
  url?: InputMaybe<Scalars['AWSURL']>;
};

export type DNode = {
  createdAt?: Maybe<Scalars['AWSDateTime']>;
  createdBy?: Maybe<Scalars['AWSDateTime']>;
  id?: Maybe<Scalars['ID']>;
  updatedAt?: Maybe<Scalars['AWSDateTime']>;
  updatedBy?: Maybe<Scalars['AWSDateTime']>;
};

export type DeleteOneProps = {
  returnConsumedCapacity?: InputMaybe<Scalars['String']>;
  returnItemCollectionMetrics?: InputMaybe<Scalars['String']>;
  returnValues?: InputMaybe<Scalars['String']>;
};

export type FindCursorProps = {
  consistentRead?: InputMaybe<Scalars['Boolean']>;
  returnConsumedCapacity?: InputMaybe<Scalars['String']>;
};

export type FindOneProps = {
  consistentRead?: InputMaybe<Scalars['Boolean']>;
  returnConsumedCapacity?: InputMaybe<Scalars['String']>;
};

export type InsertOneProps = {
  returnConsumedCapacity?: InputMaybe<Scalars['String']>;
  returnValues?: InputMaybe<Scalars['String']>;
};

export type MActor = MNode & {
  __typename?: 'MActor';
  createdAt: Scalars['AWSDateTime'];
  createdBy: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  mMovieActors?: Maybe<Array<Maybe<MMovieActor>>>;
  name?: Maybe<Scalars['String']>;
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

export type MActorInput = {
  name?: InputMaybe<Scalars['String']>;
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
  name?: Maybe<Scalars['String']>;
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
  actorId?: Maybe<Scalars['ID']>;
  createdAt: Scalars['AWSDateTime'];
  createdBy: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  mActor?: Maybe<MActor>;
  mMovie?: Maybe<MMovie>;
  movieId?: Maybe<Scalars['ID']>;
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

export type MMovieActorInput = {
  actorId?: InputMaybe<Scalars['ID']>;
  movieId?: InputMaybe<Scalars['ID']>;
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

export type MMovieInput = {
  boolean?: InputMaybe<Scalars['Boolean']>;
  date?: InputMaybe<Scalars['AWSDate']>;
  dateTime?: InputMaybe<Scalars['AWSDateTime']>;
  email?: InputMaybe<Scalars['AWSEmail']>;
  float?: InputMaybe<Scalars['Float']>;
  int?: InputMaybe<Scalars['Int']>;
  ipAddress?: InputMaybe<Scalars['AWSIPAddress']>;
  json?: InputMaybe<Scalars['AWSJSON']>;
  name?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['AWSPhone']>;
  sourceField?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['AWSTime']>;
  timestamp?: InputMaybe<Scalars['AWSTimestamp']>;
  url?: InputMaybe<Scalars['AWSURL']>;
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
  dActorDeleteOne?: Maybe<DActor>;
  dActorInsertOne?: Maybe<DActor>;
  dActorUpdateOne?: Maybe<DActor>;
  dMovieActorDeleteOne?: Maybe<DMovieActor>;
  dMovieActorInsertOne?: Maybe<DMovieActor>;
  dMovieActorUpdateOne?: Maybe<DMovieActor>;
  dMovieDeleteOne?: Maybe<DMovie>;
  dMovieInsertOne?: Maybe<DMovie>;
  dMovieUpdateOne?: Maybe<DMovie>;
  mActorDeleteOne?: Maybe<MActor>;
  mActorInsertOne?: Maybe<MActor>;
  mActorUpdateOne?: Maybe<MActor>;
  mMovieActorDeleteOne?: Maybe<MMovieActor>;
  mMovieActorInsertOne?: Maybe<MMovieActor>;
  mMovieActorUpdateOne?: Maybe<MMovieActor>;
  mMovieDeleteOne?: Maybe<MMovie>;
  mMovieInsertOne?: Maybe<MMovie>;
  mMovieUpdateOne?: Maybe<MMovie>;
  mPostFindExample?: Maybe<MPostFindExampleOutput>;
  mPostQueryExample?: Maybe<MPostQueryExampleOutput>;
};


export type MutationDActorDeleteOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  props?: InputMaybe<DeleteOneProps>;
};


export type MutationDActorInsertOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  insert: DActorInput;
  props?: InputMaybe<InsertOneProps>;
};


export type MutationDActorUpdateOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  props?: InputMaybe<UpdateOneProps>;
  update: Scalars['AWSJSON'];
};


export type MutationDMovieActorDeleteOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  props?: InputMaybe<DeleteOneProps>;
};


export type MutationDMovieActorInsertOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  insert: DMovieActorInput;
  props?: InputMaybe<InsertOneProps>;
};


export type MutationDMovieActorUpdateOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  props?: InputMaybe<UpdateOneProps>;
  update: Scalars['AWSJSON'];
};


export type MutationDMovieDeleteOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  props?: InputMaybe<DeleteOneProps>;
};


export type MutationDMovieInsertOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  insert: DMovieInput;
  props?: InputMaybe<InsertOneProps>;
};


export type MutationDMovieUpdateOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  props?: InputMaybe<UpdateOneProps>;
  update: Scalars['AWSJSON'];
};


export type MutationMActorDeleteOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  props?: InputMaybe<DeleteOneProps>;
};


export type MutationMActorInsertOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  insert: MActorInput;
  props?: InputMaybe<InsertOneProps>;
};


export type MutationMActorUpdateOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  props?: InputMaybe<UpdateOneProps>;
  update: Scalars['AWSJSON'];
};


export type MutationMMovieActorDeleteOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  props?: InputMaybe<DeleteOneProps>;
};


export type MutationMMovieActorInsertOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  insert: MMovieActorInput;
  props?: InputMaybe<InsertOneProps>;
};


export type MutationMMovieActorUpdateOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  props?: InputMaybe<UpdateOneProps>;
  update: Scalars['AWSJSON'];
};


export type MutationMMovieDeleteOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  props?: InputMaybe<DeleteOneProps>;
};


export type MutationMMovieInsertOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  insert: MMovieInput;
  props?: InputMaybe<InsertOneProps>;
};


export type MutationMMovieUpdateOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  props?: InputMaybe<UpdateOneProps>;
  update: Scalars['AWSJSON'];
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
  dActorFindCursor?: Maybe<DActorCursorConnection>;
  dActorFindOne?: Maybe<DActor>;
  dMovieActorFindCursor?: Maybe<DMovieActorCursorConnection>;
  dMovieActorFindOne?: Maybe<DMovieActor>;
  dMovieFindCursor?: Maybe<DMovieCursorConnection>;
  dMovieFindOne?: Maybe<DMovie>;
  dMovieIndexFindCursor?: Maybe<DMovieIndexCursorConnection>;
  mActorFind?: Maybe<MActorConnection>;
  mActorFindOne?: Maybe<MActor>;
  mMovieActorFind?: Maybe<MMovieActorConnection>;
  mMovieActorFindOne?: Maybe<MMovieActor>;
  mMovieFind?: Maybe<MMovieConnection>;
  mMovieFindOne?: Maybe<MMovie>;
};


export type QueryDActorFindCursorArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<Scalars['AWSJSON']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  props?: InputMaybe<FindCursorProps>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryDActorFindOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  props?: InputMaybe<FindOneProps>;
};


export type QueryDMovieActorFindCursorArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<Scalars['AWSJSON']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  props?: InputMaybe<FindCursorProps>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryDMovieActorFindOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  props?: InputMaybe<FindOneProps>;
};


export type QueryDMovieFindCursorArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<Scalars['AWSJSON']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  props?: InputMaybe<FindCursorProps>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryDMovieFindOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  props?: InputMaybe<FindOneProps>;
};


export type QueryDMovieIndexFindCursorArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<Scalars['AWSJSON']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  props?: InputMaybe<FindCursorProps>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryMActorFindArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['AWSJSON']>;
};


export type QueryMActorFindOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  props?: InputMaybe<FindOneProps>;
};


export type QueryMMovieActorFindArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['AWSJSON']>;
};


export type QueryMMovieActorFindOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  props?: InputMaybe<FindOneProps>;
};


export type QueryMMovieFindArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['AWSJSON']>;
};


export type QueryMMovieFindOneArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  props?: InputMaybe<FindOneProps>;
};

export type Subscription = {
  __typename?: 'Subscription';
  dMovieUpdated?: Maybe<DMovie>;
};

export type UpdateOneProps = {
  returnConsumedCapacity?: InputMaybe<Scalars['String']>;
  returnValues?: InputMaybe<Scalars['String']>;
};

export type SubscriptionPage_RunMutation_DMovieFragment = { __typename?: 'DMovie', id?: string | null, name?: string | null };

export type MPostFindExampleMutationVariables = Exact<{
  input: MPostFindExampleInput;
}>;


export type MPostFindExampleMutation = { __typename?: 'Mutation', mPostFindExample?: { __typename?: 'MPostFindExampleOutput', id?: string | null } | null };

export type FindExampleMMovieConnectionFragment = { __typename?: 'MMovieConnection', edges?: Array<{ __typename?: 'MMovieEdge', node?: { __typename?: 'MMovie', id: string } | null } | null> | null };

export type MMovieFindQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type MMovieFindQuery = { __typename?: 'Query', mMovieFind?: { __typename?: 'MMovieConnection', edges?: Array<{ __typename?: 'MMovieEdge', node?: { __typename?: 'MMovie', id: string } | null } | null> | null } | null };

export const SubscriptionPage_RunMutation_DMovieFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubscriptionPage_RunMutation_DMovie"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DMovie"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<SubscriptionPage_RunMutation_DMovieFragment, unknown>;
export const FindExampleMMovieConnectionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FindExampleMMovieConnection"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MMovieConnection"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<FindExampleMMovieConnectionFragment, unknown>;
export const MPostFindExampleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"mPostFindExample"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MPostFindExampleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mPostFindExample"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<MPostFindExampleMutation, MPostFindExampleMutationVariables>;
export const MMovieFindDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"mMovieFind"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mMovieFind"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MMovieFindQuery, MMovieFindQueryVariables>;