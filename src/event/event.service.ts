import {
  Inject,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KAFKA_CLIENT_NAME } from '@/kafka.options';

@Injectable()
export class StartupEventService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(
    @Inject(KAFKA_CLIENT_NAME) private readonly client: ClientKafka,
  ) {}

  async onApplicationShutdown(signal?: string) {
    await this.client.close();
  }

  async onApplicationBootstrap() {
    await this.client.connect();
  }
}
