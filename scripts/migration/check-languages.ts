import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

// .env 파일 로드
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * DB의 실제 언어 데이터 확인 스크립트
 */
async function checkLanguages() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'cms-db',
  });

  try {
    console.log('🔍 데이터베이스 연결 중...');
    await dataSource.initialize();
    console.log('✅ 연결 성공\n');

    // 언어 조회
    console.log('📋 Languages 테이블:');
    const languages = await dataSource.query(
      'SELECT id, code, name FROM languages ORDER BY code',
    );
    console.table(languages);

    // 샘플 IR translation 조회
    console.log('\n📋 IR Translations (샘플 3개):');
    const irTranslations = await dataSource.query(`
      SELECT 
        irt.id, 
        irt."irId", 
        irt."languageId",
        l.code as "languageCode",
        irt.title,
        LEFT(irt.description, 50) as description
      FROM ir_translations irt
      LEFT JOIN languages l ON l.id = irt."languageId"
      LIMIT 3
    `);
    console.table(irTranslations);

    // 샘플 ElectronicDisclosure translation 조회
    console.log('\n📋 ElectronicDisclosure Translations (샘플 3개):');
    const edTranslations = await dataSource.query(`
      SELECT 
        edt.id, 
        edt."electronicDisclosureId", 
        edt."languageId",
        l.code as "languageCode",
        edt.title,
        LEFT(edt.description, 50) as description
      FROM electronic_disclosure_translations edt
      LEFT JOIN languages l ON l.id = edt."languageId"
      LIMIT 3
    `);
    console.table(edTranslations);

    // 샘플 MainPopup translation 조회
    console.log('\n📋 MainPopup Translations (샘플 3개):');
    const mpTranslations = await dataSource.query(`
      SELECT 
        mpt.id, 
        mpt."mainPopupId", 
        mpt."languageId",
        l.code as "languageCode",
        mpt.title,
        LEFT(mpt.description, 50) as description
      FROM main_popup_translations mpt
      LEFT JOIN languages l ON l.id = mpt."languageId"
      LIMIT 3
    `);
    console.table(mpTranslations);

    console.log('\n✅ 완료!');
  } catch (error) {
    console.error('❌ 에러 발생:', error);
  } finally {
    await dataSource.destroy();
  }
}

checkLanguages();
