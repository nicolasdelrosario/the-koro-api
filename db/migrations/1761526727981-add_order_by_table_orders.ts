import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderByTableOrders1761526727981 implements MigrationInterface {
  name = 'AddOrderByTableOrders1761526727981';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" ADD "orderById" uuid`);
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_979173e968787f4661b7b793ff0" FOREIGN KEY ("orderById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_979173e968787f4661b7b793ff0"`,
    );
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "orderById"`);
  }
}
