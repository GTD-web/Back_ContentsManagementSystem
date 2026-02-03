import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmployeeNumberToAnnouncementRead1738575600000 implements MigrationInterface {
    name = 'AddEmployeeNumberToAnnouncementRead1738575600000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // employeeNumber 컬럼 추가
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                    WHERE table_name='announcement_reads' AND column_name='employeeNumber') 
                THEN
                    ALTER TABLE "announcement_reads" ADD "employeeNumber" VARCHAR(50);
                    COMMENT ON COLUMN "announcement_reads"."employeeNumber" IS '직원 사번 (SSO employeeNumber)';
                END IF;
            END $$;
        `);

        // employeeId 컬럼 주석 업데이트
        await queryRunner.query(`
            COMMENT ON COLUMN "announcement_reads"."employeeId" IS '직원 ID (내부 DB 사용자 UUID)';
        `);

        // employeeNumber 인덱스 생성
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "idx_announcement_read_employee_number" ON "announcement_reads" ("employeeNumber");
        `);

        // announcementId + employeeNumber unique 인덱스 생성
        await queryRunner.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS "uk_announcement_read_employee_number" ON "announcement_reads" ("announcementId", "employeeNumber");
        `);

        // 기존 데이터가 있다면 employeeNumber를 NULL로 유지
        // (추후 수동으로 매핑 필요하거나, 새로운 읽음 처리부터 사번이 저장됨)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 인덱스 삭제
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."uk_announcement_read_employee_number"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_announcement_read_employee_number"`);

        // employeeId 컬럼 주석 원복
        await queryRunner.query(`
            COMMENT ON COLUMN "announcement_reads"."employeeId" IS '직원 ID (외부 시스템 직원 ID - SSO)';
        `);

        // employeeNumber 컬럼 삭제
        await queryRunner.query(`
            ALTER TABLE "announcement_reads" DROP COLUMN IF EXISTS "employeeNumber";
        `);
    }
}
