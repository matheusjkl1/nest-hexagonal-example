import { HexVO } from '../vos/hex.vo';
import { IdVO } from '../vos/id.vo';
import { NomeVO } from '../vos/nome.vo';
import { Cor } from './cor.domain';

export class CorBuilder {
  private _id?: IdVO;
  private _name?: NomeVO;
  private _hex?: HexVO;

  private constructor(hex: HexVO, nome: NomeVO) {
    this._name = nome;
    this._hex = hex;
  }

  public static builder(hex: HexVO, nome: NomeVO) {
    return new CorBuilder(hex, nome);
  }

  public withId(id: IdVO) {
    this._id = id;
    return this;
  }

  public withNewId() {
    if (this._id) throw new Error('Id já existe');
    this._id = IdVO.create();
    return this;
  }

  public build(): Cor {
    return new Cor(this);
  }

  public get id(): IdVO {
    return this._id;
  }

  public get nome() {
    return this._name;
  }

  public get hex() {
    return this._hex;
  }
}
