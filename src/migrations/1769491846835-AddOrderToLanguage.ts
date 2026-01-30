import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderToLanguage1769491846835 implements MigrationInterface {
    name = 'AddOrderToLanguage1769491846835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // order 컬럼이 없는 경우에만 추가
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'languages' AND column_name = 'order'
                ) THEN
                    ALTER TABLE "languages" ADD "order" integer NOT NULL DEFAULT '0';
                    COMMENT ON COLUMN "languages"."order" IS '정렬 순서';
                END IF;
            END $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "languages"."order" IS '정렬 순서'`);
        await queryRunner.query(`ALTER TABLE "languages" DROP COLUMN "order"`);
    }

}
