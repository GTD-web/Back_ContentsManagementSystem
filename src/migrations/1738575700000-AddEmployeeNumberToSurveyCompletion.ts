import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmployeeNumberToSurveyCompletion1738575700000 implements MigrationInterface {
    name = 'AddEmployeeNumberToSurveyCompletion1738575700000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // employeeNumber 컬럼 추가
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                    WHERE table_name='survey_completions' AND column_name='employeeNumber') 
                THEN
                    ALTER TABLE "survey_completions" ADD "employeeNumber" VARCHAR(50);
                    COMMENT ON COLUMN "survey_completions"."employeeNumber" IS '직원 사번 (SSO employeeNumber)';
                END IF;
            END $$;
        `);

        // employeeId 컬럼 주석 업데이트
        await queryRunner.query(`
            COMMENT ON COLUMN "survey_completions"."employeeId" IS '직원 ID (내부 DB 사용자 UUID)';
        `);

        // employeeNumber 인덱스 생성
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "idx_survey_completion_employee_number" ON "survey_completions" ("employeeNumber");
        `);

        // surveyId + employeeNumber unique 인덱스 생성
        await queryRunner.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS "uk_survey_completion_employee_number" ON "survey_completions" ("surveyId", "employeeNumber");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 인덱스 삭제
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."uk_survey_completion_employee_number"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_survey_completion_employee_number"`);

        // employeeId 컬럼 주석 원복
        await queryRunner.query(`
            COMMENT ON COLUMN "survey_completions"."employeeId" IS '직원 ID (외부 시스템 직원 ID - SSO)';
        `);

        // employeeNumber 컬럼 삭제
        await queryRunner.query(`
            ALTER TABLE "survey_completions" DROP COLUMN IF EXISTS "employeeNumber";
        `);
    }
}
