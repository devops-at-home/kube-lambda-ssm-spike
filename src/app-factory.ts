import { App, StackProps } from 'aws-cdk-lib';
import { DockerImageStack } from './stacks/docker-image.stack';
import { LambdaSSMStack } from './stacks/lambda-ssm.stack';
import { OIDCStack } from './stacks/oidc.stack';
import { AppFactoryProps } from './types';

const stackPrefix = 'KubeLambdaSSM';

export const appFactory = (app: App, props: AppFactoryProps) => {
    const { environment, account, region } = props;

    const stackProps: StackProps = {
        env: { account, region },
        tags: {
            environment,
        },
    };

    if (props.oidcConfig) {
        new OIDCStack(app, `${stackPrefix}-OIDCStack`, {
            ...stackProps,
            ...props.oidcConfig,
        });
    }

    const { repository, imageTag } = new DockerImageStack(app, `${stackPrefix}-DockerImageStack`, {
        ...stackProps,
    });

    new LambdaSSMStack(app, `${stackPrefix}-LambdaSSMStack`, {
        ...stackProps,
        repository,
        imageTag,
    });
};
