FROM node:lts

ARG NPM_AUTH_TOKEN
ARG BEARER
ARG STRIPE_KEY
ARG CAIROTE_URL
ARG SESTERCES_URL
ARG RSS_BACKEND_URL
ARG INTERCOM_ID
ARG CACHING_URL
ARG REDIRECT_URL
ARG RENEW_DATE
ARG RENEW_DATE_QUARTERFULL

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
