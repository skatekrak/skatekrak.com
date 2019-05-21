FROM node:lts

ARG NPM_AUTH_TOKEN

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
