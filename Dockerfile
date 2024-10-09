FROM 'mcr.microsoft.com/playwright:v1.39.0-jammy'
RUN npm install -g netlify-cli node-jq
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
apt-get install -y nodejs
RUN node -v && npm -v
USER jenkins