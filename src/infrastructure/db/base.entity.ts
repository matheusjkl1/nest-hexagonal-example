import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn({
    type: 'timestamptz',
    name: 'criado_em',
    default: () => 'NOW()',
  })
  criadoEm: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    name: 'atualizado_em',
    default: () => 'NOW()',
  })
  atualizadoEm: Date;

  @DeleteDateColumn({
    type: 'timestamptz',
    name: 'deletado_em',
  })
  deletado_em: Date;
}
