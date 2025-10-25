import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTableProducts1761411722653 implements MigrationInterface {
  name = 'AddTableProducts1761411722653';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "products" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
      "title" character varying NOT NULL, 
      "description" character varying NOT NULL, 
      "price" numeric(10,2) NOT NULL DEFAULT '0', 
      "stock" integer NOT NULL, 
      "images" text NOT NULL, 
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
      "deletedAt" TIMESTAMP, 
      "addedById" uuid, 
      "categoryId" uuid, 
      CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_d7e7f53b786522ae18147bb853c" FOREIGN KEY ("addedById") 
      REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `
      ALTER TABLE "products" ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId")
      REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_d7e7f53b786522ae18147bb853c"`,
    );
    await queryRunner.query(`DROP TABLE "products"`);
  }
}
