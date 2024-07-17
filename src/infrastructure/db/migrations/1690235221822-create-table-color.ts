import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableUnique,
} from 'typeorm';
import { LENGTH_11, LENGTH_512 } from '../db-const';

export class CreateTableCor1690235221822 implements MigrationInterface {
  readonly schema: string;

  constructor() {
    this.schema = process.env.DATABASE_SCHEMA;
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = CreateTableCor1690235221822.createTable();
    await queryRunner.createTable(table);
    await queryRunner.createUniqueConstraint(
      table,
      new TableUnique({
        columnNames: ['hex'],
        name: 'cor_hex_uk',
      }),
    );

    await queryRunner.createUniqueConstraint(
      table,
      new TableUnique({
        columnNames: ['nome'],
        name: 'cor_nome_uk',
      }),
    );

    await queryRunner.createIndex(
      table,
      new TableIndex({
        columnNames: ['hex'],
        name: 'cor_hex_index',
      }),
    );
  }

  static createTable() {
    return new Table({
      name: 'cor',
      schema: process.env.DATABASE_SCHEMA,
      columns: [
        {
          name: 'id',
          type: 'uuid',
          primaryKeyConstraintName: 'cor_id_pk',
          isPrimary: true,
          isNullable: false,
        },
        {
          name: 'nome',
          type: `varchar(${LENGTH_512})`,
          isNullable: false,
        },
        {
          name: 'hex',
          type: `varchar(${LENGTH_11})`,
          isUnique: true,
          isNullable: false,
        },
        {
          name: 'criado_em',
          type: 'timestamptz',
          isNullable: true,
          default: 'NOW()',
        },
        {
          name: 'atualizado_em',
          type: 'timestamptz',
          isNullable: true,
          default: 'NOW()',
        },
        {
          name: 'deletado_em',
          type: 'timestamptz',
          isNullable: true,
        },
      ],
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(`${this.schema}.cor`, 'cor_hex_index');
    await queryRunner.dropUniqueConstraint(`${this.schema}.cor`, 'cor_hex_uk');
    await queryRunner.dropUniqueConstraint(`${this.schema}.cor`, 'cor_nome_uk');
    await queryRunner.dropTable(`${this.schema}.cor`, true, true, true);
  }
}
