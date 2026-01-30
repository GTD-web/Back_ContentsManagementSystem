import * as path from 'path';
import { parseMultipleBsonFiles } from './bson-parser';

/**
 * MongoDB BSON 데이터 샘플 확인 스크립트
 * 
 * 사용법:
 * ts-node -r tsconfig-paths/register scripts/migration/inspect-bson-data.ts
 */

const BSON_DIR = path.join(__dirname, '../../src/migrations/hompage-admin-1');

const COLLECTIONS = [
  'irmaterials',
  'managementdisclosures',
  'shareholdermeetings',
  'notifications',
];

console.log('🔍 MongoDB BSON 데이터 구조 확인\n');
console.log('='.repeat(80));

const collections = parseMultipleBsonFiles(BSON_DIR, COLLECTIONS);

for (const collectionName of COLLECTIONS) {
  const data = collections[collectionName];
  
  console.log(`\n📦 ${collectionName} (${data.length}개 문서)`);
  console.log('-'.repeat(80));
  
  if (data.length > 0) {
    const sample = data[0];
    console.log('첫 번째 문서 구조:');
    console.log(JSON.stringify(sample, null, 2));
    
    // 주요 필드 확인
    console.log('\n주요 필드:');
    console.log(`  - title: ${sample.title ? '있음' : '없음'}`);
    console.log(`  - description: ${sample.description ? '있음' : '없음'}`);
    console.log(`  - translations: ${sample.translations ? `있음 (${sample.translations.length}개)` : '없음'}`);
    console.log(`  - attachments: ${sample.attachments ? `있음 (${sample.attachments.length}개)` : '없음'}`);
    console.log(`  - categoryId: ${sample.categoryId ? '있음' : '없음'}`);
    
    if (sample.translations && sample.translations.length > 0) {
      console.log('\n번역 데이터 샘플:');
      console.log(JSON.stringify(sample.translations[0], null, 2));
    }
  } else {
    console.log('  데이터 없음');
  }
  
  console.log('='.repeat(80));
}
