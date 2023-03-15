# Setup CLI
FROM public.ecr.aws/amazonlinux/amazonlinux:2 as cli
ARG EXE_FILENAME=awscli-exe-linux-x86_64.zip
# COPY $EXE_FILENAME .
RUN yum update -y \
  && yum install -y unzip \
  && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o $EXE_FILENAME \
  && unzip $EXE_FILENAME \
  # The --bin-dir is specified so that we can copy the
  # entire bin directory from the installer stage into
  # into /usr/local/bin of the final stage without
  # accidentally copying over any other executables that
  # may be present in /usr/local/bin of the installer stage.
  && ./aws/install --bin-dir /aws-cli-bin/

# Setup Kube  
FROM public.ecr.aws/bitnami/kubectl:latest AS kube

# Build Lambda image
FROM public.ecr.aws/lambda/provided:al2

# Copy CLI
COPY --from=cli /usr/local/aws-cli/ /usr/local/aws-cli/
COPY --from=cli /aws-cli-bin/ /usr/local/bin/

# Copy Kube
COPY --from=kube /opt/bitnami/kubectl/ /usr/local/kubectl/

ENV PATH="/usr/local/kubectl/bin:$PATH"

RUN aws --help && kubectl
