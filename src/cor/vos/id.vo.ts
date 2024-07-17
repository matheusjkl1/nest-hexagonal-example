import { randomUUID } from 'crypto';
import { validate } from 'uuid';
import { ToString } from '@/infrastructure/decorators/to-string.decorator';
import { BaseException } from '@/infrastructure/model/exception.model';

@ToString()
export class IdVO {
  private constructor(readonly value: string) {}

  public static of(value?: string): IdVO {
    if (!value) throw new BaseException('ID requerido');
    if (!validate(value)) throw new BaseException('ID está inválido');
    return new IdVO(value);
  }

  static create(): IdVO {
    return new IdVO(randomUUID());
  }
}
