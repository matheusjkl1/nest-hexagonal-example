import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExtension1683981626347 implements MigrationInterface {
  readonly schema: string;

  constructor() {
    this.schema = process.env.DATABASE_SCHEMA;
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createSchema('extensions', true);
    await queryRunner.query(
      `SET search_path TO ${this.schema}, extensions, public`,
    );
    await queryRunner.query(`GRANT USAGE ON SCHEMA extensions TO public`);
    await queryRunner.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA extensions GRANT EXECUTE ON FUNCTIONS TO public`,
    );
    await queryRunner.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA extensions GRANT USAGE ON TYPES TO public`,
    );
    await queryRunner.query(
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP EXTENSION IF EXISTS "uuid-ossp" SCHEMA extensions`,
    );
    await queryRunner.dropSchema('extensions', true, true);
  }
}
