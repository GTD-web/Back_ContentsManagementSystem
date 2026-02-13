import { Module } from '@nestjs/common';
import { StorageModule } from '@libs/storage/storage.module';
import { UserUploadController } from './user-upload.controller';

@Module({
  imports: [StorageModule],
  controllers: [UserUploadController],
})
export class UserUploadModule {}
