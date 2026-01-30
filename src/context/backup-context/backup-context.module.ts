import { Module } from '@nestjs/common';
import { BackupService } from './backup.service';
import { BackupRetentionService } from './backup-retention.service';
import { BackupScheduler } from './backup.scheduler';

/**
 * 백업 Context 모듈
 *
 * 데이터베이스 백업 및 보관 정책을 관리합니다.
 */
@Module({
  providers: [BackupService, BackupRetentionService, BackupScheduler],
  exports: [BackupService, BackupRetentionService],
})
export class BackupContextModule {}
