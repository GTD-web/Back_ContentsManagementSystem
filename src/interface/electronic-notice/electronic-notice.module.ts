import { Module } from '@nestjs/common';
import { ElectronicNoticeController } from './electronic-notice.controller';

@Module({
  controllers: [ElectronicNoticeController],
  providers: [],
})
export class ElectronicNoticeModule {}
