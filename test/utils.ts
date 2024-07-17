import { AppModule } from '@/app.module';
import { base, en, Faker, pt_BR } from '@faker-js/faker';
import {
  DynamicModule,
  INestApplication,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import {
  Admin,
  Consumer,
  Kafka,
  KafkaMessage,
  Producer,
  ProducerRecord,
} from 'kafkajs';
import { DataSource, Repository } from 'typeorm';
import { EventoRepository } from 'Tests/e2e/event/event.repository';
import { ListenerController } from 'Tests/e2e/event/listener.controller';
import { randomUUID } from 'crypto';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Topics } from '@/event/topics';
import { CorEntity } from '@/cor/infrastructure/cor.entity';

export function appModuleBuilder(
  modules: DynamicModule[] = [],
): TestingModuleBuilder {
  return Test.createTestingModule({
    controllers: [ListenerController],
    imports: [AppModule, ...modules],
    providers: [ProducerService, EventoRepository],
  });
}

export async function createApp(moduleRef: TestingModuleBuilder) {
  const testingModule = await moduleRef.compile();
  return testingModule.createNestApplication({
    logger: new Logger(),
  });
}

export function connectKafkaMicroservice(app: INestApplication) {
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'api-cor-client-test',
        brokers: ['localhost:29092'],
      },
      consumer: {
        groupId: 'api-cor-consumer-test',
      },
    },
  });
}

export async function startup(app: INestApplication) {
  app.enableShutdownHooks();
  await app.startAllMicroservices();
  await app.init();
}

export async function shutdown(app: INestApplication) {
  await app.close();
}

export function getProducerService(app: INestApplication): ProducerService {
  return app.get(ProducerService);
}

export function clearMocks(...mocks: jest.Mock[]) {
  mocks.forEach((mock) => mock.mockClear());
}

export async function resetarBancoDeDados(app: INestApplication) {
  const dataSource = app.get(DataSource);
  const corRepository = dataSource.getRepository(CorEntity);
  await deleteAll(corRepository);
}

async function deleteAll(...repos: Repository<any>[]) {
  for (let i = 0; i < repos.length; i++) {
    await repos[i].createQueryBuilder().withDeleted().delete().execute();
  }
}

@Injectable()
export class ProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ProducerService.name);
  private readonly kafka: Kafka;
  private producer: Producer;
  private admin: Admin;
  private consumer: Consumer;

  constructor() {
    this.kafka = globalThis.kafka;
    this.producer = globalThis.producer;
    this.admin = globalThis.admin;
    this.consumer = globalThis.consumer;
  }

  async onModuleInit() {
    await this.admin.createTopics({
      topics: Object.keys(Topics).map((it) => ({
        topic: Topics[it],
        numPartitions: 1,
      })),
    });
    const topics = await this.admin.listTopics();
    this.logger.log(`topics=[${topics}]`);
  }

  async onModuleDestroy() {
    await this.admin.deleteTopics({
      topics: Object.keys(Topics).map((it) => Topics[it]),
    });
  }

  async produce(record: ProducerRecord) {
    return this.producer.send(record);
  }

  async listen(
    topics: string[],
    groupId = randomUUID().toString(),
    fromBeginning = true,
    quantity = 1,
  ) {
    const consumer = this.kafka.consumer({
      groupId,
      allowAutoTopicCreation: false,
      sessionTimeout: 15000,
      heartbeatInterval: 3000,
    });
    await consumer.connect();
    await consumer.subscribe({ topics, fromBeginning });
    let resolveOnConsumption: (messages: KafkaMessage[]) => void;
    let rejectOnError: (e: Error) => void;

    const returnThisPromise = new Promise<KafkaMessage[]>((resolve, reject) => {
      (resolveOnConsumption = resolve), (rejectOnError = reject);
    }).finally(() => consumer.disconnect());
    const messages: KafkaMessage[] = [];
    await consumer.run({
      autoCommit: false,
      eachMessage: async ({ message, partition, topic }) => {
        try {
          this.logger.log(
            `message=${message.value} partition=${partition}, topic=${topic}`,
          );
          if (messages.length < quantity) {
            messages.push(message);
            await consumer.commitOffsets([
              {
                topic,
                partition,
                offset: (Number(message.offset) + 1).toString(),
              },
            ]);
          }
          if (messages.length >= quantity) {
            resolveOnConsumption(messages);
          }
        } catch (e) {
          rejectOnError(e);
        }
      },
    });
    return returnThisPromise;
  }
}

export const faker = new Faker({
  locale: [pt_BR, en, base],
});

export const API_KEY_VALUE = '1';
