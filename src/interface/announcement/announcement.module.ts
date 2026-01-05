import { Module } from '@nestjs/common';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementBusinessModule } from '@business/announcement';

/**
 * 공지사항 인터페이스 모듈
 */
@Module({
  imports: [AnnouncementBusinessModule],
  controllers: [AnnouncementController],
})
export class AnnouncementInterfaceModule {}
