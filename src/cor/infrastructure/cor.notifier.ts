import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Cor } from '../domain/cor.domain';
import { Topics } from '../../event/topics';
import { KAFKA_CLIENT_NAME } from '@/kafka.options';

type CorEvent = {
  corId: string;
  nome: string;
  hex: string;
  rgb: string;
};

function buildCorEvent(cor: Cor): CorEvent {
  return {
    corId: cor.id.value,
    nome: cor.nome.value,
    hex: cor.hex.getHex(),
    rgb: cor.hex.getRGBString(),
  } satisfies CorEvent;
}

@Injectable()
export class CorCriadaNotifier {
  private readonly logger = new Logger(CorCriadaNotifier.name);

  constructor(
    @Inject(KAFKA_CLIENT_NAME) private readonly client: ClientKafka,
  ) {}

  async notify(cor: Cor) {
    this.logger.debug(cor, 'CorCriadaNotifier');
    await lastValueFrom(
      this.client.emit(Topics.COR_REGISTRADA, buildCorEvent(cor)),
      {
        defaultValue: 'Empty',
      },
    );
  }
}

@Injectable()
export class CorAtualizadaNotifier {
  private readonly logger = new Logger(CorAtualizadaNotifier.name);

  constructor(
    @Inject(KAFKA_CLIENT_NAME) private readonly client: ClientKafka,
  ) {}

  async notify(cor: Cor) {
    this.logger.debug(cor, 'CorAtualizadaNotifier');
    await lastValueFrom(
      this.client.emit(Topics.COR_ATUALIZADA, buildCorEvent(cor)),
      {
        defaultValue: 'Empty',
      },
    );
  }
}

@Injectable()
export class CorDeletadaNotifier {
  private readonly logger = new Logger(CorAtualizadaNotifier.name);

  constructor(
    @Inject(KAFKA_CLIENT_NAME) private readonly client: ClientKafka,
  ) {}

  async notify(cor: Cor) {
    this.logger.debug(cor, 'CorDeletadaNotifier');
    await lastValueFrom(
      this.client.emit(Topics.COR_DELETADA, buildCorEvent(cor)),
      {
        defaultValue: 'Empty',
      },
    );
  }
}
