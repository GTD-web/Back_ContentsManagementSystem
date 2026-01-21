import { Module } from '@nestjs/common';
import { BackupController } from './backup.controller';
import { BackupContextModule } from '@context/backup-context';

/**
 * 백업 관리 모듈
 */
@Module({
  imports: [BackupContextModule],
  controllers: [BackupController],
})
export class BackupModule {}
