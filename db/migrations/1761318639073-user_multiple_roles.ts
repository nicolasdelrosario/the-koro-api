import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserMultipleRoles1761318639073 implements MigrationInterface {
  name = 'UserMultipleRoles1761318639073';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "roles"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."users_roles_enum"`);
    await queryRunner.query(`
      CREATE TYPE "public"."users_roles_enum" AS ENUM('user', 'admin')
    `);
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD "roles" "public"."users_roles_enum"[] NOT NULL DEFAULT '{user}'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "roles"`);
    await queryRunner.query(`
      CREATE TYPE "public"."users_roles_enum" AS ENUM('user', 'admin')
    `);
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD "roles" "public"."users_roles_enum" NOT NULL DEFAULT 'user'
    `);
  }
}
