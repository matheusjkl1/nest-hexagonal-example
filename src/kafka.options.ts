import { createMechanism } from '@jm18457/kafkajs-msk-iam-authentication-mechanism';
import { ConfigService } from '@nestjs/config';
import {
  ClientOptions,
  ClientsProviderAsyncOptions,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { SASLOptions } from 'kafkajs';

export const KAFKA_CLIENT_ID = 'api-cor-id';

export const KAFKA_CLIENT_NAME = 'api-cor';

export function buildMicroserviceOptions(): MicroserviceOptions {
  const env = process.env.NODE_ENV;
  return {
    transport: Transport.KAFKA,
    options: {
      ...buildOptions(
        env,
        process.env.KAFKA_BROKERS.split(','),
        process.env.AWS_REGION,
      ),
      consumer: {
        groupId: KAFKA_CLIENT_ID,
        retry: {
          retries: 20,
          maxRetryTime: 5000,
          initialRetryTime: 300,
        },
      },
    },
  };
}

export const kafkaClientOptions: ClientsProviderAsyncOptions = {
  name: KAFKA_CLIENT_NAME,
  useFactory: (configService: ConfigService) => {
    const env = configService.get('NODE_ENV');
    return {
      transport: Transport.KAFKA,
      options: {
        ...buildOptions(
          env,
          configService.get('KAFKA_BROKERS').split(','),
          configService.get('AWS_REGION'),
        ),
        consumer: {
          groupId: KAFKA_CLIENT_ID,
          retry: {
            retries: 20,
            maxRetryTime: 5000,
            initialRetryTime: 300,
          },
        },
      },
    } as ClientOptions;
  },
  inject: [ConfigService],
};

function buildOptions(env: string, brokers: Array<string>, region: string) {
  let options = {
    client: {
      clientId: KAFKA_CLIENT_ID,
      brokers,
      sasl: undefined,
      ssl: false,
      retry: {
        initialRetryTime: 300,
        retries: 15,
        maxRetryTime: 5000,
      },
    },
  };
  if (['production', 'dev'].includes(env)) {
    options = {
      client: {
        clientId: KAFKA_CLIENT_ID,
        brokers,
        ssl: true,
        retry: {
          initialRetryTime: 300,
          retries: 15,
          maxRetryTime: 5000,
        },
        sasl: createMechanism({
          region,
        }) as unknown as SASLOptions,
      },
    };
  }
  return options;
}
