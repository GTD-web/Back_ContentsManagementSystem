import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../src/app.module';
import { BackupRetentionService } from '../../src/context/backup-context/backup-retention.service';
import { BackupType } from '../../src/context/backup-context/backup.types';

/**
 * 백업 목록 조회 스크립트
 *
 * 사용법:
 * npm run backup:list              # 모든 백업 목록
 * npm run backup:list daily        # 특정 타입만
 * npm run backup:list -- --stats   # 통계 포함
 */

async function bootstrap() {
  console.log('📋 백업 목록 조회 스크립트 시작\n');

  // NestJS 애플리케이션 초기화
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const retentionService = app.get(BackupRetentionService);

    // 명령줄 인자 확인
    const args = process.argv.slice(2);
    const backupTypeArg = args[0];
    const showStats = args.includes('--stats');

    let type: BackupType | undefined;

    if (backupTypeArg && backupTypeArg !== '--stats') {
      if (!Object.values(BackupType).includes(backupTypeArg as BackupType)) {
        console.error(`❌ 올바르지 않은 백업 타입: ${backupTypeArg}\n`);
        console.log('사용 가능한 타입:');
        Object.values(BackupType).forEach((t) => console.log(`  - ${t}`));
        process.exit(1);
      }
      type = backupTypeArg as BackupType;
    }

    // 백업 목록 조회
    const backups = await retentionService.listBackups(type);

    if (backups.length === 0) {
      console.log('📦 백업이 없습니다.\n');
      return;
    }

    console.log(`📦 백업 목록 (총 ${backups.length}개)\n`);
    console.log('='.repeat(80));

    // 타입별로 그룹화
    const groupedBackups = backups.reduce(
      (acc, backup) => {
        if (!acc[backup.type]) {
          acc[backup.type] = [];
        }
        acc[backup.type].push(backup);
        return acc;
      },
      {} as Record<BackupType, typeof backups>,
    );

    // 각 타입별로 출력
    for (const [backupType, typeBackups] of Object.entries(groupedBackups)) {
      console.log(`\n📁 ${backupType.toUpperCase()} (${typeBackups.length}개)`);
      console.log('-'.repeat(80));

      typeBackups.forEach((backup, index) => {
        const createdAt = new Date(backup.createdAt).toLocaleString('ko-KR');
        const expiresAt = new Date(backup.expiresAt).toLocaleString('ko-KR');
        const isExpired = new Date(backup.expiresAt) < new Date();

        console.log(`  ${index + 1}. ${backup.filename}`);
        console.log(`     생성: ${createdAt}`);
        console.log(
          `     만료: ${expiresAt} ${isExpired ? '⚠️ (만료됨)' : ''}`,
        );
      });
    }

    // 통계 출력
    if (showStats) {
      console.log('\n' + '='.repeat(80));
      console.log('📊 백업 통계\n');

      const statistics = await retentionService.getStatistics();

      console.log('타입별 통계:');
      for (const [backupType, stats] of Object.entries(statistics.byType)) {
        if (stats.count > 0) {
          console.log(`  ${backupType}:`);
          console.log(`    개수: ${stats.count}개`);
          console.log(`    크기: ${formatBytes(stats.totalSize)}`);
          if (stats.oldestBackup) {
            console.log(
              `    가장 오래된 백업: ${new Date(stats.oldestBackup).toLocaleString('ko-KR')}`,
            );
          }
        }
      }

      console.log(`\n전체:`);
      console.log(`  개수: ${statistics.total.count}개`);
      console.log(`  크기: ${formatBytes(statistics.total.totalSize)}`);
    }

    console.log('\n' + '='.repeat(80));
  } catch (error) {
    console.error('\n❌ 백업 목록 조회 중 오류 발생:');
    console.error(error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

/**
 * 바이트를 읽기 쉬운 형식으로 변환
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// 스크립트 실행
bootstrap();
