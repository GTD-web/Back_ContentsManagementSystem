import { Module } from '@nestjs/common';
import { AuthContextModule } from '@context/auth-context';
import { BackupController } from './backup.controller';
import { BackupContextModule } from '@context/backup-context';

/**
 * 백업 관리 모듈
 */
@Module({
  imports: [AuthContextModule, BackupContextModule],
  controllers: [BackupController],
})
export class BackupModule {}
