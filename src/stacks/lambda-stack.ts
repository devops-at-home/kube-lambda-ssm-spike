import { Stack, StackProps } from 'aws-cdk-lib';
import { IRepository } from 'aws-cdk-lib/aws-ecr';
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Architecture, DockerImageCode, Function, Handler, Runtime } from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

interface LambdaSSMStackProps extends StackProps, LambdaSSMStackConfig {}

export type LambdaSSMStackConfig = {
    repository: IRepository;
};

export class LambdaSSMStack extends Stack {
    constructor(scope: Construct, id: string, props: LambdaSSMStackProps) {
        super(scope, id, props);

        const { role } = new Function(this, 'KubeLambda', {
            code: DockerImageCode.fromEcr(props.repository, {
                entrypoint: ['kubectl', 'get', 'svc,deployment', '--all-namespaces'],
            })._bind(),
            handler: Handler.FROM_IMAGE,
            runtime: Runtime.FROM_IMAGE,
            architecture: Architecture.X86_64,
            logRetention: RetentionDays.ONE_WEEK,
            environment: {
                KUBECONFIG: '/tmp/k3s.yaml',
            },
        });

        // TODO: fine tune this
        role?.attachInlinePolicy(
            new Policy(this, 'LambdaSSMPermissions', {
                statements: [new PolicyStatement({ actions: ['ssm:*'] })],
            })
        );
    }
}
