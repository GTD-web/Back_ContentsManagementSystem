import { Module } from '@nestjs/common';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementBusinessModule } from '@business/announcement-business/announcement-business.module';
import { AnnouncementContextModule } from '@context/announcement-context/announcement-context.module';

@Module({
  imports: [AnnouncementBusinessModule, AnnouncementContextModule],
  controllers: [AnnouncementController],
})
export class AnnouncementModule {}
