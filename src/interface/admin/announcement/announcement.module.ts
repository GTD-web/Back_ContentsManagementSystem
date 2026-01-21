import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthContextModule } from '@context/auth-context';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementBusinessModule } from '@business/announcement-business/announcement-business.module';
import { AnnouncementContextModule } from '@context/announcement-context/announcement-context.module';
import { AnnouncementPermissionLog } from '@domain/core/announcement/announcement-permission-log.entity';
import { DismissedPermissionLog } from '@domain/common/dismissed-permission-log/dismissed-permission-log.entity';

@Module({
  imports: [
    AuthContextModule,
    AnnouncementBusinessModule,
    AnnouncementContextModule,
    TypeOrmModule.forFeature([AnnouncementPermissionLog, DismissedPermissionLog]),
  ],
  controllers: [AnnouncementController],
})
export class AnnouncementModule {}
