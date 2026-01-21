import { Module } from '@nestjs/common';
import { AuthContextModule } from '@context/auth-context';
import { ShareholdersMeetingBusinessModule } from '@business/shareholders-meeting-business/shareholders-meeting-business.module';
import { ShareholdersMeetingController } from './shareholders-meeting.controller';

/**
 * 주주총회 관리 모듈
 */
@Module({
  imports: [AuthContextModule, ShareholdersMeetingBusinessModule],
  controllers: [ShareholdersMeetingController],
})
export class ShareholdersMeetingAdminModule {}
