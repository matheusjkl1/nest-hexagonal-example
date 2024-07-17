import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CorBuilder } from '../domain/cor.builder';
import { Cor } from '../domain/cor.domain';
import { HexVO } from '../vos/hex.vo';
import { IdVO } from '../vos/id.vo';
import { NomeVO } from '../vos/nome.vo';
import { CorEntity } from './cor.entity';

@Injectable()
export class CorRepository {
  private readonly logger = new Logger(CorRepository.name);

  constructor(
    @InjectRepository(CorEntity)
    private readonly repository: Repository<CorEntity>,
  ) {}

  async save(cor: Cor): Promise<Cor> {
    const entity = await this.repository.save(CorEntity.create(cor));
    return this.buildCorOrNull(entity);
  }

  async delete(cor: Cor): Promise<void> {
    await this.repository.delete({
      id: cor.id.value,
    });
  }

  async findOneById(id: IdVO): Promise<Cor | null> {
    const corEncontrada = await this.repository.findOneBy({
      id: id.value,
    });
    return this.buildCorOrNull(corEncontrada);
  }

  async findOneByHexOrNome(hex: HexVO, nome: NomeVO): Promise<Cor | null> {
    const corEncontrada = await this.repository.findOne({
      where: [{ hex: ILike(hex.getHex()) }, { nome: ILike(nome.value) }],
    });
    return this.buildCorOrNull(corEncontrada);
  }

  private buildCorOrNull(entity: CorEntity) {
    if (!entity) return null;

    const cor = CorBuilder.builder(
      HexVO.of(entity.hex),
      NomeVO.of(entity.nome),
    ).withId(IdVO.of(entity.id));
    return cor.build();
  }
}
