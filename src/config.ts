import { OidcConfig } from './stacks/oidc.stack';
import { AppFactoryProps } from './types';

const oidcConfig: OidcConfig = {
    owner: 'devops-at-home',
    repo: 'kube-lambda-ssm-spike',
    // filter: 'ref:/refs/head/main', TODO: tighten permissions here
    filter: '*',
    lookup: true,
};

const account = process.env.CDK_DEFAULT_ACCOUNT!;
const region = 'ap-southeast-2';

export const config = (): AppFactoryProps[] => {
    return [
        // test
        {
            account,
            region,
            environment: 'test',
            oidcConfig,
        },
    ];
};
