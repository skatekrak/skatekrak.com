FROM node:10 as build

ARG NPM_AUTH_TOKEN 
WORKDIR /app
COPY . /app

RUN echo "registry=https://npm.skatekrak.com/" > .npmrc && \
    echo "//npm.skatekrak.com/:always-auth=true" >> .npmrc && \
    echo "//npm.skatekrak.com/:_authToken=${NPM_AUTH_TOKEN}" >> .npmrc && \
    yarn install --prod && \
    yarn build

EXPOSE 3000

CMD ["yarn", "start"];