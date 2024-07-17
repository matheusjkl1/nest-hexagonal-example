FROM node:20-alpine3.19 AS build
COPY package*.json /usr/src/app/
COPY . /usr/src/app/
RUN corepack enable \
    && yarn set version stable
WORKDIR /usr/src/app
RUN yarn install --immutable
RUN yarn build

FROM node:20-alpine3.19 AS production
RUN adduser -u 5000 -D -H usuario
USER usuario
WORKDIR /app
COPY --chown=usuario:usuario --from=build /usr/src/app/dist /app/dist
COPY --chown=usuario:usuario --from=build /usr/src/app/node_modules /app/node_modules
ENV NODE_ENV="production"
ENV TZ="America/Sao_Paulo"
ENV SERVER_PORT="3000"
ENV DATABASE_HOST=""
ENV DATABASE_USER=""
ENV DATABASE_PASSWORD=""
ENV DATABASE_NAME=""
ENV DATABASE_SCHEMA=""
ENV DATABASE_PORT=""
ENV DATABASE_LOG=""
ENV MIGRATIONS_RUN=""
ENV API_KEY=""
ENV KAFKA_BROKERS=""
ENV AWS_REGION=""
ENV AWS_S3_BUCKET=""
ENV AWS_COGNITO_CLIENT_ID=""
ENV AWS_COGNITO_USER_POOL_ID=""
ENV AWS_CLOUD_FRONT_PERFIL_BASE_URL=""
EXPOSE ${SERVER_PORT}
CMD ["node", "dist/main.js"]
