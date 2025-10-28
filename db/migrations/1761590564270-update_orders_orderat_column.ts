import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOrdersOrderatColumn1761590564270
  implements MigrationInterface
{
  name = 'UpdateOrdersOrderatColumn1761590564270';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "orderAt" SET DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "orderAt" DROP DEFAULT`,
    );
  }
}
