import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Wiki 파일 시스템의 name 컬럼을 nullable로 변경하는 마이그레이션
 * 
 * 변경 사항:
 * - wiki_file_systems 테이블의 name 컬럼을 nullable로 변경
 * - 파일(file 타입)의 경우 name이 선택사항이 됨
 * - 폴더(folder 타입)의 경우 여전히 name이 필요하므로 애플리케이션 레벨에서 검증
 */
export class MakeWikiFileSystemNameNullable1770624915157
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // name 컬럼을 nullable로 변경
    await queryRunner.query(`
      ALTER TABLE "wiki_file_systems"
      ALTER COLUMN "name" DROP NOT NULL;
    `);

    // 컬럼 comment 업데이트
    await queryRunner.query(`
      COMMENT ON COLUMN "wiki_file_systems"."name" IS '이름 (폴더명 또는 파일명, 파일의 경우 선택사항)';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // name이 NULL인 레코드가 있다면 기본값으로 채우기
    await queryRunner.query(`
      UPDATE "wiki_file_systems"
      SET "name" = COALESCE("title", '제목 없음')
      WHERE "name" IS NULL AND "type" = 'file';
    `);

    // 여전히 NULL인 레코드가 있다면 (폴더 등) 기본값 설정
    await queryRunner.query(`
      UPDATE "wiki_file_systems"
      SET "name" = '이름 없음'
      WHERE "name" IS NULL;
    `);

    // name 컬럼을 NOT NULL로 복원
    await queryRunner.query(`
      ALTER TABLE "wiki_file_systems"
      ALTER COLUMN "name" SET NOT NULL;
    `);

    // 컬럼 comment 복원
    await queryRunner.query(`
      COMMENT ON COLUMN "wiki_file_systems"."name" IS '이름 (폴더명 또는 파일명)';
    `);
  }
}
