import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Database Module
import { DatabaseModule } from '@libs/database/database.module';

// Common Modules
import { CmsCommonInterfaceModule } from '@interface/common';

// Core Domain Interface Modules
import { AnnouncementPopupInterfaceModule } from '@interface/announcement-popup';
import { AnnouncementInterfaceModule } from '@interface/announcement';
import { NewsInterfaceModule } from '@interface/news';
import { BrochureInterfaceModule } from '@interface/brochure';
import { IrInterfaceModule } from '@interface/ir';
import { ShareholdersMeetingModule } from '@interface/shareholders-meeting';
import { ElectronicNoticeModule } from '@interface/electronic-notice';

// Sub Domain Interface Modules
import { SurveyInterfaceModule } from '@interface/survey';
import { LumirStoryModule } from '@interface/lumir-story';
import { VideoGalleryModule } from '@interface/video-gallery';
import { EducationManagementModule } from '@interface/education-management';
import { WikiModule } from '@interface/wiki';

/**
 * 루미르 CMS 애플리케이션 모듈
 *
 * @description
 * - 모든 Interface Layer 모듈을 등록합니다.
 * - Interface Layer는 Business Layer와 Context Layer를 자동으로 import합니다.
 * - TypeORM을 통해 PostgreSQL 데이터베이스와 연결합니다.
 */
@Module({
  imports: [
    // 환경 변수 설정 (전역)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 데이터베이스 연결 (DatabaseModule 사용)
    DatabaseModule,

    // ========== 공통 모듈 ==========
    CmsCommonInterfaceModule,

    // ========== Core Domain 모듈 (7개) ==========
    AnnouncementPopupInterfaceModule,
    AnnouncementInterfaceModule,
    NewsInterfaceModule,
    BrochureInterfaceModule,
    IrInterfaceModule,
    ShareholdersMeetingModule,
    ElectronicNoticeModule,

    // ========== Sub Domain 모듈 (5개) ==========
    SurveyInterfaceModule,
    LumirStoryModule,
    VideoGalleryModule,
    EducationManagementModule,
    WikiModule,
  ],
})
export class AppModule {}
