ARG NODE_VERSION=18.16.1

#################
## DEVELOPMENT ##
#################
FROM node:${NODE_VERSION} AS development

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

################
## PRODUCTION ##
################
FROM node:${NODE_VERSION} AS production

ARG NODE_ENV=local
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY --from=development /app/ .

EXPOSE ${PORT}

CMD ["node", "dist/src/main"]
