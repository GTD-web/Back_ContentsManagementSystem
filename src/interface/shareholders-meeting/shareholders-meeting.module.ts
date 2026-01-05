import { Module } from '@nestjs/common';
import { ShareholdersMeetingController } from './shareholders-meeting.controller';

@Module({
  controllers: [ShareholdersMeetingController],
  providers: [],
})
export class ShareholdersMeetingModule {}
