import { OrgConfiguration } from '@jompx-org/config';

// TODO: Partial is not working here.
// We want this typed but all fields to be optional. But Typescript doesn't support nested Partial.
export const Local: Partial<OrgConfiguration> = {
    // 'org': {
    //     emails: []
    // }
}
