FROM node:10

ARG NPM_AUTH_TOKEN
ARG BACKEND_URL
ARG STRIPE_KEY
ARG RSS_BACKEND_URL

WORKDIR /app
COPY . /app

RUN echo "registry=https://npm.thepunk.tech/" > .npmrc && \
    echo "always-auth=true" >> .npmrc && \
    echo "_authToken=${NPM_AUTH_TOKEN}" >> .npmrc && \
    yarn install --frozen-lockfile && \
    yarn build && \
    yarn install --frozen-lockfile --production

EXPOSE 3000

CMD ["yarn", "start"];
