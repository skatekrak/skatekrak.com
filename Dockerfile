FROM node:8 as build

ARG NPM_AUTH_TOKEN 
WORKDIR /app
COPY . /app

RUN echo -e "registry=https://npm.skatekrak.com/" > .npmrc && \
    echo -e "//npm.skatekrak.com/:always-auth=true" >> .npmrc && \
    echo -e "//npm.skatekrak.com/:_authToken=${NPM_AUTH_TOKEN}" >> .npmrc && \
    npm install && \
    npm run build

FROM nginx:stable

COPY ./config/nginx.conf /etc/nginx/nginx.conf
COPY ./config/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/out /usr/share/nginx/html
