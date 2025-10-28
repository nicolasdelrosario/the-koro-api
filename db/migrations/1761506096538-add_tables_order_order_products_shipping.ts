import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTablesOrderOrderProductsShipping1761506096538
  implements MigrationInterface
{
  name = 'AddTablesOrderOrderProductsShipping1761506096538';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "shipping" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phone" character varying NOT NULL, "name" character varying NOT NULL DEFAULT '', "address" character varying NOT NULL, "city" character varying NOT NULL, "postCode" character varying NOT NULL, "state" character varying NOT NULL, "country" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_0dc6ac92ee9cbc2c1611d77804c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_status_enum" AS ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "orderAt" TIMESTAMP NOT NULL, "status" "public"."orders_status_enum" NOT NULL DEFAULT 'processing', "shippedAt" TIMESTAMP, "deliveredAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "updatedById" uuid, "shippingId" uuid, CONSTRAINT "REL_fa7fbee142ce934fec2862889a" UNIQUE ("shippingId"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders_products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "unitPrice" numeric(10,2) NOT NULL, "quantity" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "orderId" uuid, "productId" uuid, CONSTRAINT "PK_4945c6758fd65ffacda760b4ac9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_1102b5a0c580f845993e2f766f6" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_fa7fbee142ce934fec2862889ac" FOREIGN KEY ("shippingId") REFERENCES "shipping"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_products" ADD CONSTRAINT "FK_823bad3524a5d095453c43286bb" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_products" ADD CONSTRAINT "FK_4eff63e89274f79195e25c5c115" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders_products" DROP CONSTRAINT "FK_4eff63e89274f79195e25c5c115"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_products" DROP CONSTRAINT "FK_823bad3524a5d095453c43286bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_fa7fbee142ce934fec2862889ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_1102b5a0c580f845993e2f766f6"`,
    );
    await queryRunner.query(`DROP TABLE "orders_products"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
    await queryRunner.query(`DROP TABLE "shipping"`);
  }
}
