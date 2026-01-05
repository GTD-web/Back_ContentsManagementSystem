import { Module } from '@nestjs/common';
import { AnnouncementPopupModule as DomainAnnouncementPopupModule } from '@domain/core/announcement-popup';
import { AnnouncementPopupController } from './announcement-popup.controller';

/**
 * 공지사항 팝업 인터페이스 모듈
 */
@Module({
  imports: [DomainAnnouncementPopupModule],
  controllers: [AnnouncementPopupController],
})
export class AnnouncementPopupInterfaceModule {}
