import { BaseEntity } from '@/infrastructure/db/base.entity';
import { LENGTH_11, LENGTH_512 } from '@/infrastructure/db/db-const';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Cor } from '../domain/cor.domain';

@Entity({
  name: 'cor',
})
export class CorEntity extends BaseEntity {
  @PrimaryColumn({
    name: 'id',
  })
  id: string;

  @Column({ length: LENGTH_512 })
  nome: string;

  @Column({ length: LENGTH_11 })
  hex: string;

  static create(cor: Cor) {
    const entity = new CorEntity();
    entity.id = cor.id.value;
    entity.nome = cor.nome.value;
    entity.hex = cor.hex.getHex();
    return entity;
  }
}
