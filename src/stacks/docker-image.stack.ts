import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { IRepository } from 'aws-cdk-lib/aws-ecr';
import { DockerImageAsset, Platform } from 'aws-cdk-lib/aws-ecr-assets';
import { Construct } from 'constructs';
import { join } from 'path';

export class DockerImageStack extends Stack {
    public readonly repository: IRepository;
    public readonly imageTag: string;
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        const { repository, imageTag } = new DockerImageAsset(this, 'LambdaImage', {
            directory: join(__dirname, '..', 'docker'),
            platform: Platform.LINUX_AMD64,
        });

        this.repository = repository;
        this.imageTag = imageTag;

        new CfnOutput(this, 'RepositoryArn', {
            value: repository.repositoryArn,
        });

        new CfnOutput(this, 'ImageTag', {
            value: imageTag,
        });
    }
}
