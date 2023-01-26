import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateApiKeyTable1674759469396 implements MigrationInterface {
    name = 'CreateApiKeyTable1674759469396'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "api_key" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "calls" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_b1bd840641b8acbaad89c3d8d11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_fb080786c16de6ace7ed0b69f7" ON "api_key" ("key") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_fb080786c16de6ace7ed0b69f7"`);
        await queryRunner.query(`DROP TABLE "api_key"`);
    }

}
