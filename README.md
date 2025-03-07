# API - Cores
  
  ### A ideia desta API é representar um microserviço complexo em NESTJS que utiliza a arquitetura Hexagonal. Nela inclui:

    - Testes E2E.
    - Kafka
    - Postgre (TypeORM)
    - Docker

## Pre-requisitos

- Node 18.x.x
- Yarn 4.x.x
- Docker Engine 24.x.x
- Docker Compose 2.21.x

## Rodando em modo DEV

Tenha o Docker Engine ou o Docker Desktop instalados.

## Instalando os pacotes

```commandLine
 yarn install
```

## Executando o banco de dados

```commandLine
 docker compose up -d
```

## Migrations

**Antes de executar os comandos com as migrations é necessário configurar as variáveis de ambiente**

```commandLine
export $(xargs < .env)
```

### Executando as migrations

```commandLine
yarn migration:run
```

### Revertendo uma aplicação de uma migration

```commandLine
yarn migration:revert
```

### Verificando as migrations aplicadas

```commandLine
yarn migration:show
```

### Criando uma migration

```commandLine
yarn migration:create src/infrastructure/db/migrations/MIGRATION_NAME
```

## Executando a aplicação

```commandLine
yarn start
```

## Executando os testes

```commandLine
yarn test
```

## Libs

- NestJS 10.x.x
- Postgres 15.x
- Typeorm 0.13.x
- KafkaJS 2.x.x
- Hemlt 7.x.x
- Jest 29.x.x
- Supertest 6.x.x
- testcontainers 10.x.x
