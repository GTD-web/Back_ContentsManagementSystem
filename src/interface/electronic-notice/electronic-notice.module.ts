import { Module } from '@nestjs/common';
import { ElectronicNoticeController } from './electronic-notice.controller';
import { ElectronicNoticeBusinessModule } from '@business/electronic-notice';

@Module({
  imports: [ElectronicNoticeBusinessModule],
  controllers: [ElectronicNoticeController],
})
export class ElectronicNoticeModule {}
