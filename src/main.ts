import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { API_KEY_HEADER } from './infrastructure/rest/headers.conts';
import { buildMicroserviceOptions } from './kafka.options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
    },
  });

  const config = new DocumentBuilder()
    .setTitle('Backend - Cores')
    .setDescription('API de Cores')
    .setVersion('1.1')
    .addApiKey(
      {
        name: API_KEY_HEADER,
        type: 'apiKey',
        in: 'header',
      },
      API_KEY_HEADER,
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.connectMicroservice<MicroserviceOptions>(buildMicroserviceOptions());

  app.use(helmet());
  await Promise.all([
    app.startAllMicroservices(),
    app.listen(process.env.SERVER_PORT),
  ]);
}
bootstrap();
