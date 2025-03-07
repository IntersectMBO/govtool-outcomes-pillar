FROM node:20-alpine AS base

###################
# BUILD DEPENDENCIES
###################
FROM base AS dependencies

RUN apk add --no-cache libc6-compat

ENV NODE_ENV build

WORKDIR /usr/src/app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi


#######################
# BUILD FOR PRODUCTION
#######################
FROM base AS build

WORKDIR /usr/src/app

ENV NODE_ENV build

COPY --chown=node:node ./package.json ./
COPY --chown=node:node ./yarn.lock ./

COPY --chown=node:node --from=dependencies /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN yarn run build

RUN yarn cache clean


###################
# PRODUCTION RUNTIME
###################
FROM base AS production

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./

COPY --chown=node:node package.json ./

EXPOSE 3000

ENV HOSTNAME "0.0.0.0"

USER node

CMD [ "node", "main.js" ]