import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthCheckModule } from './infrastructure/health-check/health-check.module';
import { kafkaClientOptions } from './kafka.options';
import { EventModule } from '@/event/event.module';
import { CorModule } from './cor/cor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        process.env.NODE_ENV === 'production' || !process.env.NODE_ENV
          ? '.env'
          : `.env.${process.env.NODE_ENV}`,
      ],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        port: eval(configService.get('DATABASE_PORT')),
        schema: configService.get('DATABASE_SCHEMA'),
        entities: [`${__dirname}/**/*.entity{.js,.ts}`],
        migrations: [`${__dirname}/infrastructure/db/migrations/*{.js,.ts}`],
        migrationsRun: eval(configService.get('MIGRATIONS_RUN')),
        synchronize: false,
        logging: eval(configService.get('DATABASE_LOG')),
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [kafkaClientOptions],
    }),
    HealthCheckModule,
    CorModule,
    EventModule,
  ],
})
export class AppModule {}
