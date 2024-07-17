import { Logger } from '@nestjs/common';
import { ClientKafka, KafkaContext } from '@nestjs/microservices';

export abstract class BaseListenerController {
  protected readonly logger = new Logger(this.name);

  protected constructor(
    protected readonly client: ClientKafka,
    private readonly name: string,
  ) {}

  protected commit(context: KafkaContext): Promise<void> {
    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    this.logger.debug(
      `func=commit topic=${topic} partition=${partition} offset=${offset}`,
    );
    return this.client.commitOffsets([{ topic, partition, offset }]);
  }
}
