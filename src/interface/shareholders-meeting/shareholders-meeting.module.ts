import { Module } from '@nestjs/common';
import { ShareholdersMeetingController } from './shareholders-meeting.controller';
import { ShareholdersMeetingBusinessModule } from '@business/shareholders-meeting';

@Module({
  imports: [ShareholdersMeetingBusinessModule],
  controllers: [ShareholdersMeetingController],
})
export class ShareholdersMeetingModule {}
