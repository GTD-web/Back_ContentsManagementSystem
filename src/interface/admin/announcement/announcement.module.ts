import { Module } from '@nestjs/common';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementBusinessModule } from '@business/announcement-business/announcement-business.module';

@Module({
  imports: [AnnouncementBusinessModule],
  controllers: [AnnouncementController],
})
export class AnnouncementModule {}
