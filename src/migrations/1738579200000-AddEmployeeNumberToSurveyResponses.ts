import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmployeeNumberToSurveyResponses1738579200000 implements MigrationInterface {
    name = 'AddEmployeeNumberToSurveyResponses1738579200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ===== survey_response_texts =====
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                    WHERE table_name='survey_response_texts' AND column_name='employeeNumber') 
                THEN
                    ALTER TABLE "survey_response_texts" ADD "employeeNumber" VARCHAR(50);
                    COMMENT ON COLUMN "survey_response_texts"."employeeNumber" IS '직원 사번 (SSO employeeNumber)';
                END IF;
            END $$;
        `);

        await queryRunner.query(`
            COMMENT ON COLUMN "survey_response_texts"."employeeId" IS '직원 ID (내부 DB 사용자 UUID)';
        `);

        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "idx_survey_response_text_employee_number" ON "survey_response_texts" ("employeeNumber");
        `);

        // ===== survey_response_choices =====
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                    WHERE table_name='survey_response_choices' AND column_name='employeeNumber') 
                THEN
                    ALTER TABLE "survey_response_choices" ADD "employeeNumber" VARCHAR(50);
                    COMMENT ON COLUMN "survey_response_choices"."employeeNumber" IS '직원 사번 (SSO employeeNumber)';
                END IF;
            END $$;
        `);

        await queryRunner.query(`
            COMMENT ON COLUMN "survey_response_choices"."employeeId" IS '직원 ID (내부 DB 사용자 UUID)';
        `);

        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "idx_survey_response_choice_employee_number" ON "survey_response_choices" ("employeeNumber");
        `);

        // ===== survey_response_checkboxes =====
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                    WHERE table_name='survey_response_checkboxes' AND column_name='employeeNumber') 
                THEN
                    ALTER TABLE "survey_response_checkboxes" ADD "employeeNumber" VARCHAR(50);
                    COMMENT ON COLUMN "survey_response_checkboxes"."employeeNumber" IS '직원 사번 (SSO employeeNumber)';
                END IF;
            END $$;
        `);

        await queryRunner.query(`
            COMMENT ON COLUMN "survey_response_checkboxes"."employeeId" IS '직원 ID (내부 DB 사용자 UUID)';
        `);

        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "idx_survey_response_checkbox_employee_number" ON "survey_response_checkboxes" ("employeeNumber");
        `);

        // ===== survey_response_scales =====
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                    WHERE table_name='survey_response_scales' AND column_name='employeeNumber') 
                THEN
                    ALTER TABLE "survey_response_scales" ADD "employeeNumber" VARCHAR(50);
                    COMMENT ON COLUMN "survey_response_scales"."employeeNumber" IS '직원 사번 (SSO employeeNumber)';
                END IF;
            END $$;
        `);

        await queryRunner.query(`
            COMMENT ON COLUMN "survey_response_scales"."employeeId" IS '직원 ID (내부 DB 사용자 UUID)';
        `);

        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "idx_survey_response_scale_employee_number" ON "survey_response_scales" ("employeeNumber");
        `);

        // ===== survey_response_grids =====
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                    WHERE table_name='survey_response_grids' AND column_name='employeeNumber') 
                THEN
                    ALTER TABLE "survey_response_grids" ADD "employeeNumber" VARCHAR(50);
                    COMMENT ON COLUMN "survey_response_grids"."employeeNumber" IS '직원 사번 (SSO employeeNumber)';
                END IF;
            END $$;
        `);

        await queryRunner.query(`
            COMMENT ON COLUMN "survey_response_grids"."employeeId" IS '직원 ID (내부 DB 사용자 UUID)';
        `);

        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "idx_survey_response_grid_employee_number" ON "survey_response_grids" ("employeeNumber");
        `);

        // ===== survey_response_files =====
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                    WHERE table_name='survey_response_files' AND column_name='employeeNumber') 
                THEN
                    ALTER TABLE "survey_response_files" ADD "employeeNumber" VARCHAR(50);
                    COMMENT ON COLUMN "survey_response_files"."employeeNumber" IS '직원 사번 (SSO employeeNumber)';
                END IF;
            END $$;
        `);

        await queryRunner.query(`
            COMMENT ON COLUMN "survey_response_files"."employeeId" IS '직원 ID (내부 DB 사용자 UUID)';
        `);

        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "idx_survey_response_file_employee_number" ON "survey_response_files" ("employeeNumber");
        `);

        // ===== survey_response_datetimes =====
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                    WHERE table_name='survey_response_datetimes' AND column_name='employeeNumber') 
                THEN
                    ALTER TABLE "survey_response_datetimes" ADD "employeeNumber" VARCHAR(50);
                    COMMENT ON COLUMN "survey_response_datetimes"."employeeNumber" IS '직원 사번 (SSO employeeNumber)';
                END IF;
            END $$;
        `);

        await queryRunner.query(`
            COMMENT ON COLUMN "survey_response_datetimes"."employeeId" IS '직원 ID (내부 DB 사용자 UUID)';
        `);

        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "idx_survey_response_datetime_employee_number" ON "survey_response_datetimes" ("employeeNumber");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // survey_response_datetimes
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_survey_response_datetime_employee_number"`);
        await queryRunner.query(`
            COMMENT ON COLUMN "survey_response_datetimes"."employeeId" IS '직원 ID (외부 시스템 직원 ID - SSO)';
        `);
        await queryRunner.query(`
            ALTER TABLE "survey_response_datetimes" DROP COLUMN IF EXISTS "employeeNumber";
        `);

        // survey_response_files
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_survey_response_file_employee_number"`);
        await queryRunner.query(`
            COMMENT ON COLUMN "survey_response_files"."employeeId" IS '직원 ID (외부 시스템 직원 ID - SSO)';
        `);
        await queryRunner.query(`
            ALTER TABLE "survey_response_files" DROP COLUMN IF EXISTS "employeeNumber";
        `);

        // survey_response_grids
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_survey_response_grid_employee_number"`);
        await queryRunner.query(`
            COMMENT ON COLUMN "survey_response_grids"."employeeId" IS '직원 ID (외부 시스템 직원 ID - SSO)';
        `);
        await queryRunner.query(`
            ALTER TABLE "survey_response_grids" DROP COLUMN IF EXISTS "employeeNumber";
        `);

        // survey_response_scales
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_survey_response_scale_employee_number"`);
        await queryRunner.query(`
            COMMENT ON COLUMN "survey_response_scales"."employeeId" IS '직원 ID (외부 시스템 직원 ID - SSO)';
        `);
        await queryRunner.query(`
            ALTER TABLE "survey_response_scales" DROP COLUMN IF EXISTS "employeeNumber";
        `);

        // survey_response_checkboxes
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_survey_response_checkbox_employee_number"`);
        await queryRunner.query(`
            COMMENT ON COLUMN "survey_response_checkboxes"."employeeId" IS '직원 ID (외부 시스템 직원 ID - SSO)';
        `);
        await queryRunner.query(`
            ALTER TABLE "survey_response_checkboxes" DROP COLUMN IF EXISTS "employeeNumber";
        `);

        // survey_response_choices
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_survey_response_choice_employee_number"`);
        await queryRunner.query(`
            COMMENT ON COLUMN "survey_response_choices"."employeeId" IS '직원 ID (외부 시스템 직원 ID - SSO)';
        `);
        await queryRunner.query(`
            ALTER TABLE "survey_response_choices" DROP COLUMN IF EXISTS "employeeNumber";
        `);

        // survey_response_texts
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_survey_response_text_employee_number"`);
        await queryRunner.query(`
            COMMENT ON COLUMN "survey_response_texts"."employeeId" IS '직원 ID (외부 시스템 직원 ID - SSO)';
        `);
        await queryRunner.query(`
            ALTER TABLE "survey_response_texts" DROP COLUMN IF EXISTS "employeeNumber";
        `);
    }
}
