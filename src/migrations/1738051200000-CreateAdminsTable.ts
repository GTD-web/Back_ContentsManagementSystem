import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAdminsTable1738051200000 implements MigrationInterface {
    name = 'CreateAdminsTable1738051200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "admins" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
                "deletedAt" TIMESTAMP WITH TIME ZONE, 
                "createdBy" character varying(255), 
                "updatedBy" character varying(255), 
                "version" integer NOT NULL, 
                "employeeNumber" character varying(50) NOT NULL, 
                "name" character varying(200), 
                "email" character varying(200), 
                "isActive" boolean NOT NULL DEFAULT true, 
                "notes" text, 
                CONSTRAINT "UQ_admins_employee_number" UNIQUE ("employeeNumber"), 
                CONSTRAINT "PK_admins" PRIMARY KEY ("id")
            )
        `);
        
        await queryRunner.query(`COMMENT ON COLUMN "admins"."createdAt" IS '생성 일시'`);
        await queryRunner.query(`COMMENT ON COLUMN "admins"."updatedAt" IS '수정 일시'`);
        await queryRunner.query(`COMMENT ON COLUMN "admins"."deletedAt" IS '삭제 일시 (소프트 삭제)'`);
        await queryRunner.query(`COMMENT ON COLUMN "admins"."createdBy" IS '생성자 ID'`);
        await queryRunner.query(`COMMENT ON COLUMN "admins"."updatedBy" IS '수정자 ID'`);
        await queryRunner.query(`COMMENT ON COLUMN "admins"."version" IS '버전 (낙관적 잠금용)'`);
        await queryRunner.query(`COMMENT ON COLUMN "admins"."employeeNumber" IS '사번 (SSO에서 받은 employeeNumber)'`);
        await queryRunner.query(`COMMENT ON COLUMN "admins"."name" IS '관리자 이름'`);
        await queryRunner.query(`COMMENT ON COLUMN "admins"."email" IS '관리자 이메일'`);
        await queryRunner.query(`COMMENT ON COLUMN "admins"."isActive" IS '활성화 여부'`);
        await queryRunner.query(`COMMENT ON COLUMN "admins"."notes" IS '비고'`);
        
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_admin_employee_number" ON "admins" ("employeeNumber")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_admin_is_active" ON "admins" ("isActive")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_admin_is_active"`);
        await queryRunner.query(`DROP INDEX "public"."idx_admin_employee_number"`);
        await queryRunner.query(`DROP TABLE "admins"`);
    }
}
