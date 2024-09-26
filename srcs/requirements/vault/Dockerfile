FROM debian:bullseye

ENV VAULT_VERSION=1.17.5

RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    gnupg \
    && curl -o vault.zip https://releases.hashicorp.com/vault/${VAULT_VERSION}/vault_${VAULT_VERSION}_linux_amd64.zip \
    && unzip vault.zip \
    && mv vault /usr/local/bin/ \
    && rm -rf vault.zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# RUN groupadd vault && useradd -r -g vault vault

RUN mkdir -p /vault/config /vault/logs  
    # && chown -R vault:vault /vault

    
COPY ./conf/vault.hcl /vault/config/.
COPY ./conf/vault_config.sh /conf/vault_config.sh
COPY ./conf/django_policy.hcl /conf/django_policy.hcl
RUN chmod +x /conf/vault_config.sh
ENV VAULT_ADDR='http://127.0.0.1:8200'

# ENTRYPOINT ["vault", "server", "-config=/vault/config/vault.hcl"]
# ENTRYPOINT ["vault", "server", "-dev"]
ENTRYPOINT ["bash", "/conf/vault_config.sh"]