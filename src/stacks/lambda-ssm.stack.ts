import { Aws, Stack, StackProps } from 'aws-cdk-lib';
import { IRepository } from 'aws-cdk-lib/aws-ecr';
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Architecture, DockerImageCode, Function, Handler, Runtime } from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

interface LambdaSSMStackProps extends StackProps, LambdaSSMStackConfig {}

export type LambdaSSMStackConfig = {
    repository: IRepository;
    imageTag: string;
};

const { ACCOUNT_ID, REGION } = Aws;

export class LambdaSSMStack extends Stack {
    constructor(scope: Construct, id: string, props: LambdaSSMStackProps) {
        super(scope, id, props);

        const { repository, imageTag } = props;

        const { role } = new Function(this, 'KubeLambda', {
            code: DockerImageCode.fromEcr(repository, {
                tagOrDigest: imageTag,
            })._bind(),
            handler: Handler.FROM_IMAGE,
            runtime: Runtime.FROM_IMAGE,
            architecture: Architecture.X86_64,
            logRetention: RetentionDays.ONE_WEEK,
            environment: {
                KUBECONFIG: '/tmp/k3s.yaml',
            },
        });

        role?.attachInlinePolicy(
            new Policy(this, 'LambdaSSMPermissions', {
                statements: [
                    new PolicyStatement({ actions: ['ssm:*Session'], resources: ['*'] }),
                    new PolicyStatement({ actions: ['ssm:DescribeParameters'], resources: ['*'] }),
                    new PolicyStatement({
                        actions: ['ssm:GetParameters'],
                        resources: [`arn:aws:ssm:${REGION}:${ACCOUNT_ID}:parameter/KUBECONFIG`],
                    }),
                    new PolicyStatement({
                        actions: ['kms:Decrypt'],
                        resources: [
                            `arn:aws:kms:${REGION}:${ACCOUNT_ID}:key/149bd7e6-b504-4688-b693-9dfbfe95bf37`,
                        ],
                    }),
                ],
            })
        );
    }
}
