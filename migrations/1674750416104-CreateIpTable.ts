import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateIpTable1674750416104 implements MigrationInterface {
    name = 'CreateIpTable1674750416104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ip" ("id" SERIAL NOT NULL, "ip" character varying NOT NULL, "ipJson" character varying NOT NULL, CONSTRAINT "PK_b12fba291251bda71560e34b209" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_3d99b154990d4f0b7fb5499829" ON "ip" ("ip") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_3d99b154990d4f0b7fb5499829"`);
        await queryRunner.query(`DROP TABLE "ip"`);
    }

}
