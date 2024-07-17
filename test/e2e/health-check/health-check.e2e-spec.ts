import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { appModuleBuilder } from 'Tests/utils';
import request from 'supertest';
import { StartedGenericContainer } from 'testcontainers/build/generic-container/started-generic-container';

describe('Health check', () => {
  let app: INestApplication;
  let dbContainer: StartedGenericContainer;

  beforeAll(async () => {
    const moduleRef: TestingModule = await appModuleBuilder().compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await dbContainer.restart();
  });

  it('QUANDO a rota de health check é requisitada ENTÃO uma resposta de sucesso deve ser retornada', () => {
    return request(app.getHttpServer())
      .get('/health/check')
      .expect(HttpStatus.OK)
      .expect((response) => {
        expect(response.body.status).toBe('ok');
        expect(response.body.info.database.status).toBe('up');
      });
  });

  it('QUANDO a rota de health check é requisitada MAS o banco de dados está offline ENTÃO uma resposta de erro deve ser retornada', async () => {
    dbContainer = globalThis.startedContainers.getContainer('database_test');
    await dbContainer.stop({
      remove: false,
      removeVolumes: false,
    });
    const response = await request(app.getHttpServer()).get('/health/check');
    expect(response.statusCode).toEqual(HttpStatus.SERVICE_UNAVAILABLE);
    expect(response.body.status).toEqual('error');
    expect(response.body.details.database.status).toEqual('down');
  });
});
