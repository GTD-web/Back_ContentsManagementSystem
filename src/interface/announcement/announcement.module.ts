import { Module } from '@nestjs/common';
import { AnnouncementController } from './announcement.controller';

/**
 * 공지사항 인터페이스 모듈
 */
@Module({
  controllers: [AnnouncementController],
})
export class AnnouncementInterfaceModule {}
