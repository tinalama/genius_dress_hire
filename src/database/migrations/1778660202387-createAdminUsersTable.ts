import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateAdminUsersTable1778660202387
  implements MigrationInterface
{
  tableName = "adminUsers";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "_id",
            type: "uuid",
            generationStrategy: "uuid",
            isGenerated: true,
          },
          {
            name: "firstName",
            type: "varchar",
            isNullable: true,
            length: "200",
          },
          {
            name: "lastName",
            type: "varchar",
            isNullable: true,
            length: "200",
          },
          {
            name: "email",
            type: "varchar",
            isNullable: false,
            isUnique: true,
            length: "200",
          },
          {
            name: "phoneNumber",
            type: "varchar",
            isNullable: true,
            length: "20",
          },
          {
            name: "password",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "salt",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "status",
            type: "boolean",
            default: true,
          },
          {
            name: "token",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "tokenExpiry",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "tokenValidityDate",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "lastLoginAt",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "deletedAt",
            type: "timestamp",
            isNullable: true,
          },
        ],
      }),
      false,
    );

    // Create indexes for frequently searched fields
    const indexFields = ["email", "firstName", "lastName", "phoneNumber", "status"];

    for (const field of indexFields) {
      await queryRunner.createIndex(
        this.tableName,
        new TableIndex({
          name: `IDX_ADMIN_USERS_${field.toUpperCase()}`,
          columnNames: [field],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(this.tableName);

    if (!table) {
      return;
    }

    // Drop indexes
    const indexFields = ["email", "firstName", "lastName", "phoneNumber", "status"];
    for (const field of indexFields) {
      const indexName = `IDX_ADMIN_USERS_${field.toUpperCase()}`;
      const index = table.indices.find((idx) => idx.name === indexName);
      if (index) {
        await queryRunner.dropIndex(this.tableName, indexName);
      }
    }

    await queryRunner.dropTable(this.tableName);
  }
}
