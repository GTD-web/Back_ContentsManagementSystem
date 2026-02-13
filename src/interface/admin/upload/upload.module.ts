import { Module } from '@nestjs/common';
import { StorageModule } from '@libs/storage/storage.module';
import { UploadController } from './upload.controller';
import { TempFileCleanupScheduler } from './temp-file-cleanup.scheduler';

@Module({
  imports: [StorageModule],
  controllers: [UploadController],
  providers: [TempFileCleanupScheduler],
})
export class UploadModule {}
