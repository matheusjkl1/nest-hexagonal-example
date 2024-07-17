import { ToString } from '@/infrastructure/decorators/to-string.decorator';
import { NomeVO } from '../vos/nome.vo';
import { Input } from '@/infrastructure/base.service';
import { HexVO } from '../vos/hex.vo';
import { IdVO } from '../vos/id.vo';

@ToString()
export class RegistrarCorInput implements Input {
  constructor(
    readonly nome: NomeVO,
    readonly hex: HexVO,
  ) {}
}

@ToString()
export class AtualizarCorInput implements Input {
  constructor(
    readonly id: IdVO,
    readonly nome: NomeVO,
    readonly hex: HexVO,
  ) {}
}

@ToString()
export class DeletarCorInput implements Input {
  constructor(readonly id: IdVO) {}
}
