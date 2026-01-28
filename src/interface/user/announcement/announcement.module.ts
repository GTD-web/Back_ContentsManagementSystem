import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthContextModule } from '@context/auth-context';
import { UserAnnouncementController } from './announcement.controller';
import { AnnouncementBusinessModule } from '@business/announcement-business/announcement-business.module';
import { AnnouncementRead } from '@domain/core/announcement/announcement-read.entity';

@Module({
  imports: [
    AuthContextModule,
    AnnouncementBusinessModule,
    TypeOrmModule.forFeature([AnnouncementRead]),
  ],
  controllers: [UserAnnouncementController],
})
export class UserAnnouncementModule {}
