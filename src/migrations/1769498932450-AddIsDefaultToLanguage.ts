import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsDefaultToLanguage1769498932450 implements MigrationInterface {
    name = 'AddIsDefaultToLanguage1769498932450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // isDefault 컬럼이 없는 경우에만 추가
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'languages' AND column_name = 'isDefault'
                ) THEN
                    ALTER TABLE "languages" ADD "isDefault" boolean NOT NULL DEFAULT false;
                    COMMENT ON COLUMN "languages"."isDefault" IS '기본 언어 여부 (시스템 기본 언어)';
                END IF;
            END $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "languages"."isDefault" IS '기본 언어 여부 (시스템 기본 언어)'`);
        await queryRunner.query(`ALTER TABLE "languages" DROP COLUMN "isDefault"`);
    }

}
