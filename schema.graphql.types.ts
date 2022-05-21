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
  mPost1Find?: Maybe<MPost1Connection>;
  mPost2Find?: Maybe<MPost2Connection>;
  mPost3Find?: Maybe<MPost3Connection>;
  mPost4Find?: Maybe<MPost4Connection>;
  mPost5Find?: Maybe<MPost5Connection>;
  mPost6Find?: Maybe<MPost6Connection>;
  mPost7Find?: Maybe<MPost7Connection>;
  mPost8Find?: Maybe<MPost8Connection>;
  mPost9Find?: Maybe<MPost9Connection>;
  mPost10Find?: Maybe<MPost10Connection>;
  mPost11Find?: Maybe<MPost11Connection>;
  mPost12Find?: Maybe<MPost12Connection>;
  mPost13Find?: Maybe<MPost13Connection>;
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


export type QueryMPost1FindArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
  skip?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryMPost2FindArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
  skip?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryMPost3FindArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
  skip?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryMPost4FindArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
  skip?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryMPost5FindArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
  skip?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryMPost6FindArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
  skip?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryMPost7FindArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
  skip?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryMPost8FindArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
  skip?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryMPost9FindArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
  skip?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryMPost10FindArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
  skip?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryMPost11FindArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
  skip?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryMPost12FindArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
  skip?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryMPost13FindArgs = {
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

export type MPost1 = MNode & {
  __typename?: 'MPost1';
  date?: Maybe<Scalars['AWSDateTime']>;
  title?: Maybe<Scalars['String']>;
  mcomments?: Maybe<Array<Maybe<MComment>>>;
  id: Scalars['ID'];
  isDeleted: Scalars['Boolean'];
  dateCreated: Scalars['AWSDateTime'];
  dateUpdated: Scalars['AWSDateTime'];
};

export type MPost1Edge = {
  __typename?: 'MPost1Edge';
  node?: Maybe<MPost1>;
};

export type MPost1Connection = {
  __typename?: 'MPost1Connection';
  edges?: Maybe<Array<Maybe<MPost1Edge>>>;
  pageInfo: PageInfoOffset;
  totalCount?: Maybe<Scalars['Int']>;
};

export type MPost2 = MNode & {
  __typename?: 'MPost2';
  date?: Maybe<Scalars['AWSDateTime']>;
  title?: Maybe<Scalars['String']>;
  mcomments?: Maybe<Array<Maybe<MComment>>>;
  id: Scalars['ID'];
  isDeleted: Scalars['Boolean'];
  dateCreated: Scalars['AWSDateTime'];
  dateUpdated: Scalars['AWSDateTime'];
};

export type MPost2Edge = {
  __typename?: 'MPost2Edge';
  node?: Maybe<MPost2>;
};

export type MPost2Connection = {
  __typename?: 'MPost2Connection';
  edges?: Maybe<Array<Maybe<MPost2Edge>>>;
  pageInfo: PageInfoOffset;
  totalCount?: Maybe<Scalars['Int']>;
};

export type MPost3 = MNode & {
  __typename?: 'MPost3';
  date?: Maybe<Scalars['AWSDateTime']>;
  title?: Maybe<Scalars['String']>;
  mcomments?: Maybe<Array<Maybe<MComment>>>;
  id: Scalars['ID'];
  isDeleted: Scalars['Boolean'];
  dateCreated: Scalars['AWSDateTime'];
  dateUpdated: Scalars['AWSDateTime'];
};

export type MPost3Edge = {
  __typename?: 'MPost3Edge';
  node?: Maybe<MPost3>;
};

export type MPost3Connection = {
  __typename?: 'MPost3Connection';
  edges?: Maybe<Array<Maybe<MPost3Edge>>>;
  pageInfo: PageInfoOffset;
  totalCount?: Maybe<Scalars['Int']>;
};

export type MPost4 = MNode & {
  __typename?: 'MPost4';
  date?: Maybe<Scalars['AWSDateTime']>;
  title?: Maybe<Scalars['String']>;
  mcomments?: Maybe<Array<Maybe<MComment>>>;
  id: Scalars['ID'];
  isDeleted: Scalars['Boolean'];
  dateCreated: Scalars['AWSDateTime'];
  dateUpdated: Scalars['AWSDateTime'];
};

export type MPost4Edge = {
  __typename?: 'MPost4Edge';
  node?: Maybe<MPost4>;
};

export type MPost4Connection = {
  __typename?: 'MPost4Connection';
  edges?: Maybe<Array<Maybe<MPost4Edge>>>;
  pageInfo: PageInfoOffset;
  totalCount?: Maybe<Scalars['Int']>;
};

export type MPost5 = MNode & {
  __typename?: 'MPost5';
  date?: Maybe<Scalars['AWSDateTime']>;
  title?: Maybe<Scalars['String']>;
  mcomments?: Maybe<Array<Maybe<MComment>>>;
  id: Scalars['ID'];
  isDeleted: Scalars['Boolean'];
  dateCreated: Scalars['AWSDateTime'];
  dateUpdated: Scalars['AWSDateTime'];
};

export type MPost5Edge = {
  __typename?: 'MPost5Edge';
  node?: Maybe<MPost5>;
};

export type MPost5Connection = {
  __typename?: 'MPost5Connection';
  edges?: Maybe<Array<Maybe<MPost5Edge>>>;
  pageInfo: PageInfoOffset;
  totalCount?: Maybe<Scalars['Int']>;
};

export type MPost6 = MNode & {
  __typename?: 'MPost6';
  date?: Maybe<Scalars['AWSDateTime']>;
  title?: Maybe<Scalars['String']>;
  mcomments?: Maybe<Array<Maybe<MComment>>>;
  id: Scalars['ID'];
  isDeleted: Scalars['Boolean'];
  dateCreated: Scalars['AWSDateTime'];
  dateUpdated: Scalars['AWSDateTime'];
};

export type MPost6Edge = {
  __typename?: 'MPost6Edge';
  node?: Maybe<MPost6>;
};

export type MPost6Connection = {
  __typename?: 'MPost6Connection';
  edges?: Maybe<Array<Maybe<MPost6Edge>>>;
  pageInfo: PageInfoOffset;
  totalCount?: Maybe<Scalars['Int']>;
};

export type MPost7 = MNode & {
  __typename?: 'MPost7';
  date?: Maybe<Scalars['AWSDateTime']>;
  title?: Maybe<Scalars['String']>;
  mcomments?: Maybe<Array<Maybe<MComment>>>;
  id: Scalars['ID'];
  isDeleted: Scalars['Boolean'];
  dateCreated: Scalars['AWSDateTime'];
  dateUpdated: Scalars['AWSDateTime'];
};

export type MPost7Edge = {
  __typename?: 'MPost7Edge';
  node?: Maybe<MPost7>;
};

export type MPost7Connection = {
  __typename?: 'MPost7Connection';
  edges?: Maybe<Array<Maybe<MPost7Edge>>>;
  pageInfo: PageInfoOffset;
  totalCount?: Maybe<Scalars['Int']>;
};

export type MPost8 = MNode & {
  __typename?: 'MPost8';
  date?: Maybe<Scalars['AWSDateTime']>;
  title?: Maybe<Scalars['String']>;
  mcomments?: Maybe<Array<Maybe<MComment>>>;
  id: Scalars['ID'];
  isDeleted: Scalars['Boolean'];
  dateCreated: Scalars['AWSDateTime'];
  dateUpdated: Scalars['AWSDateTime'];
};

export type MPost8Edge = {
  __typename?: 'MPost8Edge';
  node?: Maybe<MPost8>;
};

export type MPost8Connection = {
  __typename?: 'MPost8Connection';
  edges?: Maybe<Array<Maybe<MPost8Edge>>>;
  pageInfo: PageInfoOffset;
  totalCount?: Maybe<Scalars['Int']>;
};

export type MPost9 = MNode & {
  __typename?: 'MPost9';
  date?: Maybe<Scalars['AWSDateTime']>;
  title?: Maybe<Scalars['String']>;
  mcomments?: Maybe<Array<Maybe<MComment>>>;
  id: Scalars['ID'];
  isDeleted: Scalars['Boolean'];
  dateCreated: Scalars['AWSDateTime'];
  dateUpdated: Scalars['AWSDateTime'];
};

export type MPost9Edge = {
  __typename?: 'MPost9Edge';
  node?: Maybe<MPost9>;
};

export type MPost9Connection = {
  __typename?: 'MPost9Connection';
  edges?: Maybe<Array<Maybe<MPost9Edge>>>;
  pageInfo: PageInfoOffset;
  totalCount?: Maybe<Scalars['Int']>;
};

export type MPost10 = MNode & {
  __typename?: 'MPost10';
  date?: Maybe<Scalars['AWSDateTime']>;
  title?: Maybe<Scalars['String']>;
  mcomments?: Maybe<Array<Maybe<MComment>>>;
  id: Scalars['ID'];
  isDeleted: Scalars['Boolean'];
  dateCreated: Scalars['AWSDateTime'];
  dateUpdated: Scalars['AWSDateTime'];
};

export type MPost10Edge = {
  __typename?: 'MPost10Edge';
  node?: Maybe<MPost10>;
};

export type MPost10Connection = {
  __typename?: 'MPost10Connection';
  edges?: Maybe<Array<Maybe<MPost10Edge>>>;
  pageInfo: PageInfoOffset;
  totalCount?: Maybe<Scalars['Int']>;
};

export type MPost11 = MNode & {
  __typename?: 'MPost11';
  date?: Maybe<Scalars['AWSDateTime']>;
  title?: Maybe<Scalars['String']>;
  mcomments?: Maybe<Array<Maybe<MComment>>>;
  id: Scalars['ID'];
  isDeleted: Scalars['Boolean'];
  dateCreated: Scalars['AWSDateTime'];
  dateUpdated: Scalars['AWSDateTime'];
};

export type MPost11Edge = {
  __typename?: 'MPost11Edge';
  node?: Maybe<MPost11>;
};

export type MPost11Connection = {
  __typename?: 'MPost11Connection';
  edges?: Maybe<Array<Maybe<MPost11Edge>>>;
  pageInfo: PageInfoOffset;
  totalCount?: Maybe<Scalars['Int']>;
};

export type MPost12 = MNode & {
  __typename?: 'MPost12';
  date?: Maybe<Scalars['AWSDateTime']>;
  title?: Maybe<Scalars['String']>;
  mcomments?: Maybe<Array<Maybe<MComment>>>;
  id: Scalars['ID'];
  isDeleted: Scalars['Boolean'];
  dateCreated: Scalars['AWSDateTime'];
  dateUpdated: Scalars['AWSDateTime'];
};

export type MPost12Edge = {
  __typename?: 'MPost12Edge';
  node?: Maybe<MPost12>;
};

export type MPost12Connection = {
  __typename?: 'MPost12Connection';
  edges?: Maybe<Array<Maybe<MPost12Edge>>>;
  pageInfo: PageInfoOffset;
  totalCount?: Maybe<Scalars['Int']>;
};

export type MPost13 = MNode & {
  __typename?: 'MPost13';
  date?: Maybe<Scalars['AWSDateTime']>;
  title?: Maybe<Scalars['String']>;
  mcomments?: Maybe<Array<Maybe<MComment>>>;
  id: Scalars['ID'];
  isDeleted: Scalars['Boolean'];
  dateCreated: Scalars['AWSDateTime'];
  dateUpdated: Scalars['AWSDateTime'];
};

export type MPost13Edge = {
  __typename?: 'MPost13Edge';
  node?: Maybe<MPost13>;
};

export type MPost13Connection = {
  __typename?: 'MPost13Connection';
  edges?: Maybe<Array<Maybe<MPost13Edge>>>;
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
