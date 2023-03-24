FROM node:18.15.0-alpine3.16 AS development

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

RUN apk add git \
  && apk add openssh-client \
  && apk add openssl

USER node

WORKDIR /app

COPY --chown=node:node .env.example /app/.env

COPY --chown=node:node package.json yarn.lock /app/

COPY --chown=node:node . .

RUN openssl genrsa -out storage/oauth/private.pem 2048 \
  && openssl rsa -in storage/oauth/private.pem -pubout -out storage/oauth/public.crt

RUN yarn install \
  && yarn prisma:generate \
  && yarn build

EXPOSE 3000 5555 9229

FROM node:18.15.0-alpine3.16 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

USER node

WORKDIR /app

COPY --chown=node:node package.json yarn.lock /app/

COPY --chown=node:node . .

RUN yarn

COPY --chown=node:node --from=development /app/node_modules/.prisma /app/node_modules/.prisma

COPY --chown=node:node --from=development /app/dist /app/dist
