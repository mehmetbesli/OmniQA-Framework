# ==============================================================================
# OmniQA Unified Polyglot Test Automation Framework Dockerfile
# Base: Official Microsoft Playwright image (includes Node.js + all browsers + OS deps)
# Adds: Eclipse Temurin JDK 21, Apache Maven, Apache JMeter, PowerShell Core
# ==============================================================================
FROM mcr.microsoft.com/playwright:v1.50.1-jammy

LABEL maintainer="Mehmet Besli"
LABEL description="OmniQA Unified Polyglot Test Framework Container (Playwright TS, REST Assured, H2 DB, JMeter)"

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Set environment variables for Java and JMeter
ENV JAVA_HOME="/usr/lib/jvm/temurin-21-jdk-amd64"
ENV JMETER_HOME="/opt/apache-jmeter"
ENV PATH="${PATH}:${JMETER_HOME}/bin:${JAVA_HOME}/bin"

# 1. Install Eclipse Temurin JDK 21, Maven, curl, wget, gnupg, ca-certificates
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      wget \
      curl \
      gnupg \
      ca-certificates \
      tar \
      unzip \
      libssl3 && \
    mkdir -p /etc/apt/keyrings && \
    wget -qO - https://packages.adoptium.net/artifactory/api/gpg/key/public | gpg --dearmor -o /etc/apt/keyrings/adoptium.gpg && \
    echo "deb [signed-by=/etc/apt/keyrings/adoptium.gpg] https://packages.adoptium.net/artifactory/deb jammy main" | tee /etc/apt/sources.list.d/adoptium.list && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
      temurin-21-jdk \
      maven && \
    rm -rf /var/lib/apt/lists/*

# 2. Install Apache JMeter (5.6.3)
ARG JMETER_VERSION=5.6.3
RUN echo "Installing Apache JMeter ${JMETER_VERSION}..." && \
    (curl -fSL "https://dlcdn.apache.org/jmeter/binaries/apache-jmeter-${JMETER_VERSION}.tgz" -o /tmp/jmeter.tgz || \
     curl -fSL "https://archive.apache.org/dist/jmeter/binaries/apache-jmeter-${JMETER_VERSION}.tgz" -o /tmp/jmeter.tgz) && \
    tar -xzf /tmp/jmeter.tgz -C /opt && \
    mv /opt/apache-jmeter-${JMETER_VERSION} /opt/apache-jmeter && \
    chmod +x /opt/apache-jmeter/bin/jmeter && \
    ln -s /opt/apache-jmeter/bin/jmeter /usr/local/bin/jmeter && \
    rm /tmp/jmeter.tgz

# 3. Install PowerShell Core (pwsh 7.4.x)
ARG PWSH_VERSION=7.4.6
RUN echo "Installing PowerShell Core ${PWSH_VERSION}..." && \
    curl -sSL -o /tmp/powershell.tar.gz "https://github.com/PowerShell/PowerShell/releases/download/v${PWSH_VERSION}/powershell-${PWSH_VERSION}-linux-x64.tar.gz" && \
    mkdir -p /opt/microsoft/powershell/7 && \
    tar zxf /tmp/powershell.tar.gz -C /opt/microsoft/powershell/7 && \
    chmod +x /opt/microsoft/powershell/7/pwsh && \
    ln -s /opt/microsoft/powershell/7/pwsh /usr/bin/pwsh && \
    rm /tmp/powershell.tar.gz

# Set working directory
WORKDIR /app

# 4. Copy dependency manifests for caching optimization
COPY package.json package-lock.json ./
RUN npm ci

COPY pom.xml ./
# Resolve project dependencies quickly without downloading unneeded plugin trees
RUN mvn dependency:resolve -B || true

# 5. Copy full project files
COPY . .

# Ensure scripts have execute permissions
RUN chmod +x entrypoint.sh run-e2e.ps1

# Default execution entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["-Env", "qa"]
