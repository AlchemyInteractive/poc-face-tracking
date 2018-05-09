FROM node:9.11-alpine

WORKDIR /usr/src/app

ADD . .

RUN npm install

USER node

EXPOSE 8000

CMD [ "npm", "start" ]

