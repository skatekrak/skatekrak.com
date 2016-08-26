FROM node:latest

RUN mkdir -p /app
WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 8080

CMD ["npm", "start"]