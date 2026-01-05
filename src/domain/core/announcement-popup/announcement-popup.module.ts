import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnouncementPopup } from './announcement-popup.entity';
import { AnnouncementPopupService } from './announcement-popup.service';

/**
 * 공지사항 팝업 모듈
 */
@Module({
  imports: [TypeOrmModule.forFeature([AnnouncementPopup])],
  providers: [AnnouncementPopupService],
  exports: [AnnouncementPopupService],
})
export class AnnouncementPopupModule {}
