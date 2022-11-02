import { Component, OnInit } from '@angular/core';
import { defer } from 'rxjs';
import { API } from 'aws-amplify';
import gql from 'graphql-tag';
import * as t from '../../../../../../schema.graphql.types';
import { GraphqlService } from '@jompx/graphql'

@Component({
    selector: 'jompx-org-subscription',
    templateUrl: './subscription.page.html',
    styleUrls: ['./subscription.page.css'],
})
export class SubscriptionPage implements OnInit {

    constructor() { }

    ngOnInit() {
    }

    public runMutation() {

        gql`fragment SubscriptionPage_RunMutation_DMovie on DMovie {
            id
            name
        }`;

        // GraphqlService.updateOne<t.DMovie>(API.graphql, t.SubscriptionPage_RunMutation_DMovieFragmentDoc, {
        GraphqlService.updateOne<t.DMovie>(API, t.SubscriptionPage_RunMutation_DMovieFragmentDoc, {
            input: { name: 'movie2' },
            filter: JSON.stringify({ id: { $eq: '1' } })
        }).subscribe(output => {
            console.log('output', output);
        });
    }

    // public async runMutation() {

    //     // const query = gql`mutation createBBenefitPlan (
    //     //     $employerLeadId: String!
    //     //     $mbenefitPlanCreateInput: MBenefitPlanCreateInput
    //     // ) {
    //     //     createBBenefitPlan(employerLeadId: $employerLeadId, mbenefitPlanCreateInput: $mbenefitPlanCreateInput) {
    //     //         item {
    //     //             mbenefitPlanCreateOutput {
    //     //                 item {
    //     //                     id
    //     //                 }
    //     //             }
    //     //             mbenefitPlanRateCreateManyOutput {
    //     //                 item {
    //     //                     insertedIds
    //     //                 }
    //     //             }
    //     //         }
    //     //     }
    //     // }`;

    //     gql`fragment SubscriptionPage_RunMutation_DMovie on DMovie {
    //         id
    //     }`;
    //     const query = GraphqlQuery.updateOne(t.SubscriptionPage_RunMutation_DMovieFragmentDoc)

    //     // TODO: gql DocumentNode doesn't work. Reason unknown.
    //     // const query = `mutation MyMutation (
    //     //     $input: DMovieUpdateOneInput!,
    //     //     $filter: AWSJSON
    //     // ) {
    //     //     dMovieUpdateOne(input: $input, filter: $filter) {
    //     //         id
    //     //         name
    //     //     }
    //     // }`;

    //     const variables: t.MutationDMovieUpdateOneArgs = {
    //         input: { name: 'movie2' },
    //         filter: JSON.stringify({ id: { $eq: '1' } })
    //     };

    //     const data = await API.graphql({ query, variables })
    //     API.graphql
    //     console.log('data', data);

    //     // defer(() => API.graphql({ query, variables }) as Promise<t.DMovie>).subscribe(data => {
    //     //     console.log('data', data);
    //     // })
    // }
}
