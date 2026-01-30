import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * category_id 컬럼명을 categoryId로 변경하는 마이그레이션
 * 
 * 배경:
 * - 이전 마이그레이션에서 category_id (snake_case)로 추가됨
 * - 프로젝트의 모든 컬럼이 camelCase로 통일되어야 함
 * 
 * 목적:
 * - 데이터베이스 스키마의 일관성 확보
 * - 모든 컬럼을 camelCase로 통일
 */
export class RenameCategoryIdColumns1737621000000 implements MigrationInterface {
  name = 'RenameCategoryIdColumns1737621000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const tables = [
      'brochures',
      'irs',
      'electronic_disclosures',
      'shareholders_meetings',
      'announcements',
      'lumir_stories',
      'video_galleries',
      'news',
      'main_popups',
    ];

    // 각 테이블의 category_id를 categoryId로 변경
    for (const table of tables) {
      // snake_case 컬럼이 존재하는지 확인
      const snakeCaseExists = await queryRunner.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = '${table}' 
        AND column_name = 'category_id'
      `);

      // camelCase 컬럼이 존재하는지 확인
      const camelCaseExists = await queryRunner.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = '${table}' 
        AND column_name = 'categoryId'
      `);

      // snake_case가 있고 camelCase가 없으면 변경
      if (snakeCaseExists.length > 0 && camelCaseExists.length === 0) {
        await queryRunner.query(`
          ALTER TABLE "${table}" 
          RENAME COLUMN "category_id" TO "categoryId"
        `);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tables = [
      'brochures',
      'irs',
      'electronic_disclosures',
      'shareholders_meetings',
      'announcements',
      'lumir_stories',
      'video_galleries',
      'news',
      'main_popups',
    ];

    // 롤백: categoryId를 category_id로 되돌림
    for (const table of tables) {
      const camelCaseExists = await queryRunner.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = '${table}' 
        AND column_name = 'categoryId'
      `);

      if (camelCaseExists.length > 0) {
        await queryRunner.query(`
          ALTER TABLE "${table}" 
          RENAME COLUMN "categoryId" TO "category_id"
        `);
      }
    }
  }
}
