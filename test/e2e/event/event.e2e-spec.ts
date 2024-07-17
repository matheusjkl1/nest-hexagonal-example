import { INestApplication, Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TestingModule } from '@nestjs/testing';
import { ProducerService, appModuleBuilder, faker } from '../../utils';
import { EventoRepository } from './event.repository';

describe('Base de testes com eventos', () => {
  let app: INestApplication;
  let producer: ProducerService;
  const repositoryMock = {
    salvar: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await appModuleBuilder()
      .overrideProvider(EventoRepository)
      .useValue(repositoryMock)
      .compile();
    app = moduleRef.createNestApplication({
      logger: new Logger(),
    });
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'cor-api',
          brokers: ['localhost:29092'],
        },
      },
    });
    app.enableShutdownHooks();
    await app.startAllMicroservices();
    await app.init();
    producer = app.get(ProducerService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('QUANDO um evento é enviado ENTÃO o evento deve manuseado', async () => {
    const descricao = faker.person.jobDescriptor();
    const message = {
      key: faker.string.uuid(),
      value: JSON.stringify({
        descricao,
      }),
    };
    const [_, messages] = await Promise.all([
      producer.produce({
        topic: 'evento.algo-aconteceu',
        messages: [message],
      }),
      producer.listen(['evento.algo-aconteceu']),
    ]);
    expect(repositoryMock.salvar).toHaveBeenCalledWith({ descricao });
    expect(messages).toHaveLength(1);
  });
});
