import { Module } from '@nestjs/common';
import { ShareholdersMeetingBusinessModule } from '@business/shareholders-meeting-business/shareholders-meeting-business.module';
import { ShareholdersMeetingController } from './shareholders-meeting.controller';

/**
 * 주주총회 관리 모듈
 */
@Module({
  imports: [ShareholdersMeetingBusinessModule],
  controllers: [ShareholdersMeetingController],
})
export class ShareholdersMeetingAdminModule {}
