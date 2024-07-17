import { Logger } from '@nestjs/common';

export abstract class BaseService<I extends Input, O extends Output> {
  protected readonly logger = new Logger(this.name);

  protected constructor(private readonly name: string) {}

  async execute(input: I, output?: O): Promise<void> {
    this.logger.debug(`func=execute input=${input}`);
    await this.perform(input, output);
    this.logger.debug(`output=${output || ''}`);
  }

  protected abstract perform(input: I, output?: O): Promise<void>;
}

export interface Input {
  toString(): string;
}

export interface Output<T = undefined> {
  toString(): string;

  handle(obj: T): void;
}

export class NullOutput implements Output {
  toString(): string {
    return '';
  }
  handle(): void {}
}
