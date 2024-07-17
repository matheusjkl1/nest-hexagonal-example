import * as path from 'path';
import { DockerComposeEnvironment, Wait } from 'testcontainers';
import { Kafka, logLevel, Partitioners } from 'kafkajs';

export default async (): Promise<void> => {
  const environment = new DockerComposeEnvironment(
    `${path.resolve('./')}`,
    'docker-compose.test.yml',
  )
    .withNoRecreate()
    .withWaitStrategy('database_test', Wait.forListeningPorts())
    .withWaitStrategy('zookeeper_test', Wait.forListeningPorts())
    .withWaitStrategy(
      'kafka_test',
      Wait.forLogMessage(
        '[KafkaServer id=2] started (kafka.server.KafkaServer)',
      ),
    )
    .withWaitStrategy(
      'mockserver_test',
      Wait.forLogMessage('INFO 1080 started on port: 1080'),
    );
  console.log('Iniciando os containers');
  globalThis.startedContainers = await environment.up();
  console.log('Iniciando a configuração com o Kafka');
  globalThis.kafka = new Kafka({
    brokers: ['localhost:29092'],
    logLevel: logLevel.NOTHING,
    clientId: 'producer-test',
  });
  globalThis.admin = globalThis.kafka.admin();
  globalThis.consumer = globalThis.kafka.consumer({
    groupId: 'consumer-test',
    allowAutoTopicCreation: true,
  });
  globalThis.producer = globalThis.kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
    allowAutoTopicCreation: false,
  });
  await globalThis.producer.connect();
  await globalThis.admin.connect();
  await globalThis.consumer.connect();
};
