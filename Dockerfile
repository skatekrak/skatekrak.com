FROM node:10 as build

ARG NPM_AUTH_TOKEN
ARG BACKEND_URL
ARG STRIPE_KEY

WORKDIR /app
COPY . /app

RUN echo "registry=https://npm.thepunk.tech/" > .npmrc && \
    echo "//npm.thepunk.tech/:always-auth=true" >> .npmrc && \
    echo "//npm.thepunk.tech/:_authToken=${NPM_AUTH_TOKEN}" >> .npmrc && \
    yarn install && \
    yarn build && \
    yarn install --prod

EXPOSE 3000

CMD ["yarn", "start"];
