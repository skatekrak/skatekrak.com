FROM node:8 as build

ARG NPM_AUTH_TOKEN 
WORKDIR /app
COPY . /app

RUN echo "registry=https://npm.skatekrak.com/" > .npmrc && \
    echo "//npm.skatekrak.com/:always-auth=true" >> .npmrc && \
    echo "//npm.skatekrak.com/:_authToken=${NPM_AUTH_TOKEN}" >> .npmrc && \
    yarn install && \
    yarn build:prod

FROM nginx:stable

COPY ./config/nginx.conf /etc/nginx/nginx.conf
COPY ./config/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/public /usr/share/nginx/html
