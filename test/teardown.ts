import { StartedDockerComposeEnvironment } from 'testcontainers';

export default async (): Promise<void> => {
  if (globalThis.startedContainers instanceof StartedDockerComposeEnvironment) {
    console.log('Removendo containers dos testes');
    await globalThis.startedContainers.down({
      removeVolumes: true,
    });
  }
  console.log('Encerrando conexão com o Kafka');
  await globalThis.admin.disconnect();
  await globalThis.producer.disconnect();
  await globalThis.consumer.disconnect();
};
