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

export enum AuthStrategy {
  Private = 'private',
  Public = 'public',
  Owners = 'owners',
  Groups = 'groups',
  Custom = 'custom'
}

export enum AuthProvider {
  ApiKey = 'apiKey',
  Iam = 'iam',
  Oidc = 'oidc',
  UserPools = 'userPools',
  Function = 'function'
}

export enum AuthOperation {
  Find = 'find',
  FindOne = 'findOne',
  InsertOne = 'insertOne',
  InsertMany = 'insertMany',
  UpdateOne = 'updateOne',
  UpdateMany = 'updateMany',
  UpsertOne = 'upsertOne',
  UpsertMany = 'upsertMany',
  DeleteOne = 'deleteOne',
  DeleteMany = 'deleteMany'
}

export type AuthRule = {
  allow: AuthStrategy;
  provider: AuthProvider;
  ownerField?: InputMaybe<Scalars['String']>;
  identityClaim?: InputMaybe<Scalars['String']>;
  groupsField?: InputMaybe<Scalars['String']>;
  groupClaim?: InputMaybe<Scalars['String']>;
  groups?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  operations?: InputMaybe<Array<InputMaybe<AuthOperation>>>;
};

export type MNode = {
  id: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  createdBy: Scalars['AWSDateTime'];
  updatedAt: Scalars['AWSDateTime'];
  updatedBy: Scalars['AWSDateTime'];
};

export type MMovie = MNode & {
  __typename?: 'MMovie';
  name: Scalars['String'];
  exampleBoolean?: Maybe<Scalars['Boolean']>;
  exampleFloat?: Maybe<Scalars['Float']>;
  exampleInt?: Maybe<Scalars['Int']>;
  exampleDate?: Maybe<Scalars['AWSDate']>;
  exampleDateTime?: Maybe<Scalars['AWSDateTime']>;
  exampleEmail?: Maybe<Scalars['AWSEmail']>;
  exampleIpAddress?: Maybe<Scalars['AWSIPAddress']>;
  exampleJson?: Maybe<Scalars['AWSJSON']>;
  examplePhone?: Maybe<Scalars['AWSPhone']>;
  exampleTime?: Maybe<Scalars['AWSTime']>;
  exampleTimestamp?: Maybe<Scalars['AWSTimestamp']>;
  exampleUrl?: Maybe<Scalars['AWSURL']>;
  exampleSourceField?: Maybe<Scalars['String']>;
  mMovieActors: Array<Maybe<MMovieActor>>;
  id: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  createdBy: Scalars['AWSDateTime'];
  updatedAt: Scalars['AWSDateTime'];
  updatedBy: Scalars['AWSDateTime'];
};

export type MMovieEdge = {
  __typename?: 'MMovieEdge';
  node?: Maybe<MMovie>;
};

export type MMovieConnection = {
  __typename?: 'MMovieConnection';
  edges?: Maybe<Array<Maybe<MMovieEdge>>>;
  pageInfo: PageInfoOffset;
  totalCount?: Maybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  mMovieFind?: Maybe<MMovieConnection>;
  mMovieActorFind?: Maybe<MMovieActorConnection>;
  mActorFind?: Maybe<MActorConnection>;
};


export type QueryMMovieFindArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  sort?: InputMaybe<Scalars['AWSJSON']>;
  skip?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryMMovieActorFindArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  sort?: InputMaybe<Scalars['AWSJSON']>;
  skip?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryMActorFindArgs = {
  filter?: InputMaybe<Scalars['AWSJSON']>;
  sort?: InputMaybe<Scalars['AWSJSON']>;
  skip?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};

export type MMovieActor = MNode & {
  __typename?: 'MMovieActor';
  movieId: Scalars['ID'];
  actorId: Scalars['ID'];
  mMovie: MMovie;
  mActor: MMovie;
  id: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  createdBy: Scalars['AWSDateTime'];
  updatedAt: Scalars['AWSDateTime'];
  updatedBy: Scalars['AWSDateTime'];
};

export type MMovieActorEdge = {
  __typename?: 'MMovieActorEdge';
  node?: Maybe<MMovieActor>;
};

export type MMovieActorConnection = {
  __typename?: 'MMovieActorConnection';
  edges?: Maybe<Array<Maybe<MMovieActorEdge>>>;
  pageInfo: PageInfoOffset;
  totalCount?: Maybe<Scalars['Int']>;
};

export type MActor = MNode & {
  __typename?: 'MActor';
  name: Scalars['String'];
  mMovieActors?: Maybe<Array<Maybe<MMovieActor>>>;
  id: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  createdBy: Scalars['AWSDateTime'];
  updatedAt: Scalars['AWSDateTime'];
  updatedBy: Scalars['AWSDateTime'];
};

export type MActorEdge = {
  __typename?: 'MActorEdge';
  node?: Maybe<MActor>;
};

export type MActorConnection = {
  __typename?: 'MActorConnection';
  edges?: Maybe<Array<Maybe<MActorEdge>>>;
  pageInfo: PageInfoOffset;
  totalCount?: Maybe<Scalars['Int']>;
};

export type PageInfoCursor = {
  __typename?: 'PageInfoCursor';
  hasPreviousPage: Scalars['Boolean'];
  hasNextPage: Scalars['Boolean'];
  startCursor: Scalars['String'];
  endCursor: Scalars['String'];
};

export type PageInfoOffset = {
  __typename?: 'PageInfoOffset';
  skip: Scalars['Int'];
  limit: Scalars['Int'];
};
