import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announcement } from '@domain/core/announcement/announcement.entity';
import { AnnouncementService } from './announcement.service';

/**
 * 공지사항 비즈니스 모듈
 *
 * @description
 * - 공지사항 관련 비즈니스 서비스를 제공합니다.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Announcement])],
  providers: [AnnouncementService],
  exports: [AnnouncementService],
})
export class AnnouncementBusinessModule {}
