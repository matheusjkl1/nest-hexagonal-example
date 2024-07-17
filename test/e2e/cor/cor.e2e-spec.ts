import { CorController } from '@/cor/application/cor.controller';
import { CorRepository } from '@/cor/infrastructure/cor.repository';
import { HexVO } from '@/cor/vos/hex.vo';
import { NomeVO } from '@/cor/vos/nome.vo';
import { Topics } from '@/event/topics';
import {
  API_KEY_HEADER,
  COLOR_ID_HEADER,
} from '@/infrastructure/rest/headers.conts';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModuleBuilder } from '@nestjs/testing';
import {
  API_KEY_VALUE,
  ProducerService,
  appModuleBuilder,
  createApp,
  faker,
  resetarBancoDeDados,
  shutdown,
  startup,
} from 'Tests/utils';
import request from 'supertest';
import { atualizarCorPayload, registrarCorPayload } from './payload.factory';
import { IdVO } from '@/cor/vos/id.vo';

describe('Cores - Testes', () => {
  let app: INestApplication;
  let producer: ProducerService;
  beforeAll(async () => {
    const moduleRef: TestingModuleBuilder = appModuleBuilder();
    app = await createApp(moduleRef);
    await startup(app);
    producer = app.get(ProducerService);
  });

  afterEach(async () => {
    await resetarBancoDeDados(app);
  });

  afterAll(async () => {
    await shutdown(app);
  });

  it('QUANDO é solicitado o registro de uma cor na aplicação ENTÃO uma resposta de sucesso deve ser retornada', async () => {
    const [response, messages] = await Promise.all([
      request(app.getHttpServer())
        .post(CorController.BASE_URL)
        .set(API_KEY_HEADER, API_KEY_VALUE)
        .send(registrarCorPayload)
        .expect(HttpStatus.OK),
      producer.listen([Topics.COR_REGISTRADA], 'cor-e2e-spec'),
    ]);

    const repository = app.get<CorRepository>(CorRepository);
    const domain = await repository.findOneByHexOrNome(
      HexVO.of(registrarCorPayload.hex),
      NomeVO.of(registrarCorPayload.nome),
    );
    expect(domain.hex.getHex()).toEqual(registrarCorPayload.hex);
    expect(domain.nome.value).toEqual(registrarCorPayload.nome);
    expect(messages).toHaveLength(1);
    const event = JSON.parse(messages[0].value.toString());
    expect(domain.id.value).not.toBeNull();
    expect(event.corId).toEqual(domain.id.value);
    expect(event.nome).toEqual(domain.nome.value);
    expect(event.hex).toEqual(domain.hex.getHex());
    expect(event.rgb).toEqual(domain.hex.getRGBString());
    const body = response.body;

    expect(body.id).toEqual(domain.id.value);
    expect(body.nome).toEqual(domain.nome.value);
    expect(body.hex).toEqual(domain.hex.getHex());
    expect(body.rgb).toEqual(domain.hex.getRGBString());
    expect(body.hsl).toEqual(domain.hex.getHSLString());
  });

  it('QUANDO é solicita o registro de uma cor na aplicação MAS a cor já esta registrada ENTÃO uma resposta de erro deve ser retornada', async () => {
    await request(app.getHttpServer())
      .post(CorController.BASE_URL)
      .set(API_KEY_HEADER, API_KEY_VALUE)
      .send(registrarCorPayload)
      .expect(HttpStatus.OK);
    const [response, _] = await Promise.all([
      request(app.getHttpServer())
        .post(CorController.BASE_URL)
        .set(API_KEY_HEADER, API_KEY_VALUE)
        .send(registrarCorPayload)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY),
      producer.listen([Topics.COR_REGISTRADA], 'cor-e2e-spec'),
    ]);

    const body = response.body;
    expect(body.message).toEqual('Cor já registrada.');
  });

  it('QUANDO é solicitado a atualização de uma cor na aplicação ENTÃO uma resposta de sucesso deve ser retornada', async () => {
    const [{ body }, _] = await Promise.all([
      request(app.getHttpServer())
        .post(CorController.BASE_URL)
        .set(API_KEY_HEADER, API_KEY_VALUE)
        .send(registrarCorPayload)
        .expect(HttpStatus.OK),
      producer.listen([Topics.COR_REGISTRADA], 'cor-e2e-spec'),
    ]);

    const [response, messages] = await Promise.all([
      request(app.getHttpServer())
        .put(CorController.BASE_URL)
        .set(API_KEY_HEADER, API_KEY_VALUE)
        .set(COLOR_ID_HEADER, body.id)
        .send(atualizarCorPayload)
        .expect(HttpStatus.OK),
      producer.listen([Topics.COR_ATUALIZADA], 'cor-e2e-spec'),
    ]);

    const repository = app.get<CorRepository>(CorRepository);
    const domain = await repository.findOneById(IdVO.of(body.id));
    const corId = domain.id;
    expect(domain.hex.getHex()).toEqual(atualizarCorPayload.hex);
    expect(domain.nome.value).toEqual(atualizarCorPayload.nome);
    expect(messages).toHaveLength(1);
    const event = JSON.parse(messages[0].value.toString());
    expect(corId).not.toBeNull();
    expect(event.corId).toEqual(corId.value);

    const bodyResponse = response.body;

    expect(bodyResponse.id).toEqual(domain.id.value);
    expect(bodyResponse.nome).toEqual(domain.nome.value);
    expect(bodyResponse.hex).toEqual(domain.hex.getHex());
    expect(bodyResponse.rgb).toEqual(domain.hex.getRGBString());
    expect(bodyResponse.hsl).toEqual(domain.hex.getHSLString());
  });

  it('QUANDO é solicitado a atualização de uma cor na aplicação MAS a cor não está registrada ENTÃO uma resposta de erro deve ser retornada', async () => {
    const [{ body }] = await Promise.all([
      request(app.getHttpServer())
        .put(CorController.BASE_URL)
        .set(API_KEY_HEADER, API_KEY_VALUE)
        .set(COLOR_ID_HEADER, faker.string.uuid())
        .send(atualizarCorPayload)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY),
    ]);
    expect(body.message).toEqual('Cor não registrada.');
  });

  it('QUANDO é solicitado a busca de uma cor na aplicação ENTÃO uma resposta de sucesso deve ser retornada', async () => {
    const [
      {
        body: { id },
      },
      _messages,
    ] = await Promise.all([
      request(app.getHttpServer())
        .post(CorController.BASE_URL)
        .set(API_KEY_HEADER, API_KEY_VALUE)
        .send(registrarCorPayload)
        .expect(HttpStatus.OK),
      producer.listen([Topics.COR_REGISTRADA], 'cor-e2e-spec'),
    ]);

    const { body } = await request(app.getHttpServer())
      .get(CorController.BASE_URL)
      .set(API_KEY_HEADER, API_KEY_VALUE)
      .set(COLOR_ID_HEADER, id)
      .send(registrarCorPayload)
      .expect(HttpStatus.OK);

    expect(body.id).toEqual(id);
    expect(body.nome).toEqual(registrarCorPayload.nome);
    expect(body.hex).toEqual(registrarCorPayload.hex);
  });

  it('QUANDO é solicitado a busca de uma cor na aplicação MAS a cor não está registrada ENTÃO uma resposta de erro deve ser retornada', async () => {
    const { body } = await request(app.getHttpServer())
      .get(CorController.BASE_URL)
      .set(API_KEY_HEADER, API_KEY_VALUE)
      .set(COLOR_ID_HEADER, faker.string.uuid())
      .send(registrarCorPayload)
      .expect(HttpStatus.NOT_FOUND);

    expect(body.message).toEqual('Cor não registrada.');
  });

  it('QUANDO é solicitado a exclusão de uma cor na aplicação ENTÃO uma resposta de sucesso deve ser retornada', async () => {
    const [
      {
        body: { id },
      },
      _messages,
    ] = await Promise.all([
      request(app.getHttpServer())
        .post(CorController.BASE_URL)
        .set(API_KEY_HEADER, API_KEY_VALUE)
        .send(registrarCorPayload)
        .expect(HttpStatus.OK),
      producer.listen([Topics.COR_REGISTRADA], 'cor-e2e-spec'),
    ]);
    const repository = app.get<CorRepository>(CorRepository);
    const domain = await repository.findOneById(IdVO.of(id));
    const [_, messages] = await Promise.all([
      await request(app.getHttpServer())
        .delete(CorController.BASE_URL)
        .set(API_KEY_HEADER, API_KEY_VALUE)
        .set(COLOR_ID_HEADER, id)
        .send(registrarCorPayload)
        .expect(HttpStatus.NO_CONTENT),
      producer.listen([Topics.COR_DELETADA], 'cor-e2e-spec'),
    ]);
    const domainAfterDelete = await repository.findOneById(IdVO.of(id));
    expect(domainAfterDelete).toBeNull();
    expect(messages).toHaveLength(1);
    const event = JSON.parse(messages[0].value.toString());
    expect(domain.id.value).not.toBeNull();
    expect(event.corId).toEqual(domain.id.value);
    expect(event.nome).toEqual(domain.nome.value);
    expect(event.hex).toEqual(domain.hex.getHex());
    expect(event.rgb).toEqual(domain.hex.getRGBString());
  });

  it('QUANDO é solicitado a exclusão de uma cor na aplicação MAS a cor não está registrada ENTÃO uma resposta de erro deve ser retornada', async () => {
    const { body } = await request(app.getHttpServer())
      .delete(CorController.BASE_URL)
      .set(API_KEY_HEADER, API_KEY_VALUE)
      .set(COLOR_ID_HEADER, faker.string.uuid())
      .send(registrarCorPayload)
      .expect(HttpStatus.NOT_FOUND);

    expect(body.message).toEqual('Cor não registrada.');
  });
});
