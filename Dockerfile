FROM node:latest

RUN mkdir -p /app
WORKDIR /app

COPY . /app

RUN npm install && npm run build:html

EXPOSE 8080

CMD ["npm", "start"]