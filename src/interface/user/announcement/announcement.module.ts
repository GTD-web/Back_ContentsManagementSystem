import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthContextModule } from '@context/auth-context';
import { UserAnnouncementController } from './announcement.controller';
import { AnnouncementBusinessModule } from '@business/announcement-business/announcement-business.module';
import { AnnouncementRead } from '@domain/core/announcement/announcement-read.entity';
import { SurveyModule } from '@domain/sub/survey/survey.module';
import { FileUploadModule } from '@domain/common/file-upload/file-upload.module';

@Module({
  imports: [
    AuthContextModule,
    AnnouncementBusinessModule,
    SurveyModule,
    FileUploadModule,
    TypeOrmModule.forFeature([AnnouncementRead]),
  ],
  controllers: [UserAnnouncementController],
})
export class UserAnnouncementModule {}
