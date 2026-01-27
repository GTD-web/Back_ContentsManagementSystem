import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsDefaultToLanguage1769498932450 implements MigrationInterface {
    name = 'AddIsDefaultToLanguage1769498932450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "languages" ADD "isDefault" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`COMMENT ON COLUMN "languages"."isDefault" IS '기본 언어 여부 (시스템 기본 언어)'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "languages"."isDefault" IS '기본 언어 여부 (시스템 기본 언어)'`);
        await queryRunner.query(`ALTER TABLE "languages" DROP COLUMN "isDefault"`);
    }

}
