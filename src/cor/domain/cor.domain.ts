import { ToString } from '@/infrastructure/decorators/to-string.decorator';
import { IdVO } from '../vos/id.vo';
import { CorBuilder } from './cor.builder';
import { HexVO } from '../vos/hex.vo';
import { NomeVO } from '../vos/nome.vo';

@ToString()
export class Cor {
  private _id: IdVO;
  private _hex: HexVO;
  private _nome: NomeVO;

  constructor(builder: CorBuilder) {
    this._id = builder.id;
    this._nome = builder.nome;
    this._hex = builder.hex;
  }

  public get id(): IdVO {
    return this._id;
  }

  public get hex(): HexVO {
    return this._hex;
  }

  public get nome(): NomeVO {
    return this._nome;
  }

  atualizar(novaCor: Cor) {
    this._nome = novaCor.nome;
    this._hex = novaCor.hex;
  }
}
