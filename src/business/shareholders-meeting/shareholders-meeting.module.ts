import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShareholdersMeeting } from '@domain/core/shareholders-meeting/shareholders-meeting.entity';
import { ShareholdersMeetingService } from './shareholders-meeting.service';

/**
 * 주주총회 비즈니스 모듈
 *
 * @description
 * - 주주총회 관련 비즈니스 서비스를 제공합니다.
 */
@Module({
  imports: [TypeOrmModule.forFeature([ShareholdersMeeting])],
  providers: [ShareholdersMeetingService],
  exports: [ShareholdersMeetingService],
})
export class ShareholdersMeetingBusinessModule {}
