FROM node:16

ARG NPM_AUTH_TOKEN

WORKDIR /app
COPY . /app

EXPOSE 3636

RUN yarn install --frozen-lockfile && \
    yarn build && \
    yarn install --frozen-lockfile --production

CMD ["yarn", "run", "start:cmd:prod"]
