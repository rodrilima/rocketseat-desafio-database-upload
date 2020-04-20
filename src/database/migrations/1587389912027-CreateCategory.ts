import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export default class CreateCategory1587389912027 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "categories",
      columns: [
        {
          name: "id",
          type: "uuid",
          isPrimary: true,
          generationStrategy: "uuid",
          default: "uuid_generate_v4()"
        },
        {
          name: "title",
          type: "varchar"
        },
        {
          name: "created_at",
          type: "timestamp",
          default: "now()"
        },
        {
          name: "updated_at",
          type: "timestamp",
          default: "now()"
        }
      ]
    }))

    await queryRunner.createForeignKey("transactions", new TableForeignKey({
      name: "JoinTransactionsAndCategories",
      columnNames: ["category_id"],
      referencedTableName: "categories",
      referencedColumnNames: ["id"],
      onDelete: "SET NULL",
      onUpdate: "CASCADE"
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("transactions", "JoinTransactionsAndCategories")
    await queryRunner.dropTable("categories");
  }
}
