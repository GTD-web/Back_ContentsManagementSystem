import { Module } from '@nestjs/common';
import { UserAnnouncementController } from './announcement.controller';
import { AnnouncementBusinessModule } from '@business/announcement-business/announcement-business.module';

@Module({
  imports: [AnnouncementBusinessModule],
  controllers: [UserAnnouncementController],
})
export class UserAnnouncementModule {}
