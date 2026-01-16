import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementBusinessModule } from '@business/announcement-business/announcement-business.module';
import { AnnouncementContextModule } from '@context/announcement-context/announcement-context.module';
import { AnnouncementPermissionLog } from '@domain/core/announcement/announcement-permission-log.entity';

@Module({
  imports: [
    AnnouncementBusinessModule,
    AnnouncementContextModule,
    TypeOrmModule.forFeature([AnnouncementPermissionLog]),
  ],
  controllers: [AnnouncementController],
})
export class AnnouncementModule {}
