import { OidcConfig } from './stacks/oidc.stack';

export type AppFactoryProps = {
    oidcConfig?: OidcConfig;
    environment: Environment;
    account: string;
    region: string;
};

const environments = ['test', 'prod'] as const;
export type Environment = (typeof environments)[number];
