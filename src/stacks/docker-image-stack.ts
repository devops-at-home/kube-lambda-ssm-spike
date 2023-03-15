import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { IRepository } from 'aws-cdk-lib/aws-ecr';
import { DockerImageAsset, Platform } from 'aws-cdk-lib/aws-ecr-assets';
import { Construct } from 'constructs';
import { join } from 'path';

interface DockerImageStackProps extends StackProps, DockerImageStackConfig {}

export type DockerImageStackConfig = {};

export class DockerImageStack extends Stack {
    public readonly repository: IRepository;
    constructor(scope: Construct, id: string, props: DockerImageStackProps) {
        super(scope, id, props);

        const { repository } = new DockerImageAsset(this, 'LambdaImage', {
            directory: join(__dirname, '..', 'docker'),
            platform: Platform.LINUX_AMD64,
        });

        this.repository = repository;

        new CfnOutput(this, 'RepositoryArn', {
            value: repository.repositoryArn,
        });
    }
}
