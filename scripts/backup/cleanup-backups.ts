import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../src/app.module';
import { BackupRetentionService } from '../../src/context/backup-context/backup-retention.service';

/**
 * 만료된 백업 정리 스크립트
 *
 * 사용법:
 * npm run backup:cleanup
 */

async function bootstrap() {
  console.log('🧹 만료된 백업 정리 스크립트 시작\n');

  // NestJS 애플리케이션 초기화
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const retentionService = app.get(BackupRetentionService);

    console.log('📋 만료된 백업을 확인하고 있습니다...\n');

    const result = await retentionService.applyRetentionPolicies();

    console.log('='.repeat(50));
    console.log('📊 정리 결과');
    console.log('='.repeat(50));
    console.log(`📦 전체 백업: ${result.total}개`);
    console.log(`🗑️  삭제된 백업: ${result.deleted}개`);
    console.log(`❌ 오류: ${result.errors}개`);

    if (result.deleted > 0) {
      console.log('\n✅ 만료된 백업이 성공적으로 정리되었습니다.');
    } else {
      console.log('\n✅ 정리할 만료된 백업이 없습니다.');
    }

    if (result.errors > 0) {
      console.warn(
        `\n⚠️  ${result.errors}개의 파일 처리 중 오류가 발생했습니다.`,
      );
    }
  } catch (error) {
    console.error('\n❌ 백업 정리 중 오류 발생:');
    console.error(error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

// 스크립트 실행
bootstrap();
