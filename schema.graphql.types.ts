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
  AWSTime: any;
  AWSDateTime: any;
  AWSTimestamp: any;
  AWSEmail: any;
  AWSJSON: any;
  AWSURL: any;
  AWSPhone: any;
  AWSIPAddress: any;
};

export type MpostBusinessGraphqlInput = {
  number1: Scalars['Int'];
};

export type MpostBusinessGraphqlPayload = {
  __typename?: 'MpostBusinessGraphqlPayload';
  id: Scalars['String'];
};

export type MpostBusinessGraphqlOutput = {
  __typename?: 'MpostBusinessGraphqlOutput';
  output?: Maybe<MpostBusinessGraphqlPayload>;
};

export type Mutation = {
  __typename?: 'Mutation';
  mpostBusinessGraphql?: Maybe<MpostBusinessGraphqlOutput>;
};


export type MutationMpostBusinessGraphqlArgs = {
  input: MpostBusinessGraphqlInput;
};

export type SortInput = {
  fieldName: Scalars['String'];
  direction: Scalars['Int'];
};

export type MNode = {
  id: Scalars['ID'];
  isDeleted: Scalars['Boolean'];
  dateCreated: Scalars['AWSDateTime'];
  dateUpdated: Scalars['AWSDateTime'];
};

export type MPost = MNode & {
  __typename?: 'MPost';
  date?: Maybe<Scalars['AWSDateTime']>;
  title?: Maybe<Scalars['String']>;
  mcomments?: Maybe<Array<Maybe<MComment>>>;
  id: Scalars['ID'];
  isDeleted: Scalars['Boolean'];
  dateCreated: Scalars['AWSDateTime'];
  dateUpdated: Scalars['AWSDateTime'];
};

export type MPostEdge = {
  __typename?: 'MPostEdge';
  node?: Maybe<MPost>;
};

export type MPostConnection = {
  __typename?: 'MPostConnection';
  edges?: Maybe<Array<Maybe<MPostEdge>>>;
  pageInfo: PageInfoOffset;
  totalCount?: Maybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  mPostFind?: Maybe<MPostConnection>;
  mCommentFind?: Maybe<MCommentConnection>;
};


export type QueryMPostFindArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
  skip?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryMCommentFindArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
  skip?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};

export type MComment = MNode & {
  __typename?: 'MComment';
  id: Scalars['ID'];
  html?: Maybe<Scalars['String']>;
  mpostId?: Maybe<Scalars['ID']>;
  mpost?: Maybe<MPost>;
  isDeleted: Scalars['Boolean'];
  dateCreated: Scalars['AWSDateTime'];
  dateUpdated: Scalars['AWSDateTime'];
};

export type MCommentEdge = {
  __typename?: 'MCommentEdge';
  node?: Maybe<MComment>;
};

export type MCommentConnection = {
  __typename?: 'MCommentConnection';
  edges?: Maybe<Array<Maybe<MCommentEdge>>>;
  pageInfo: PageInfoOffset;
  totalCount?: Maybe<Scalars['Int']>;
};

export type PageInfoOffset = {
  __typename?: 'PageInfoOffset';
  skip: Scalars['Int'];
  limit: Scalars['Int'];
};

export type PageInfoCursor = {
  __typename?: 'PageInfoCursor';
  hasPreviousPage: Scalars['Boolean'];
  hasNextPage: Scalars['Boolean'];
  startCursor: Scalars['String'];
  endCursor: Scalars['String'];
};
