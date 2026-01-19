import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Services
import { SeedDataContextService } from './seed-data-context.service';

// Entities
import { Language } from '@domain/common/language/language.entity';
import { Category } from '@domain/common/category/category.entity';
import { Announcement } from '@domain/core/announcement/announcement.entity';
import { AnnouncementRead } from '@domain/core/announcement/announcement-read.entity';
import { News } from '@domain/core/news/news.entity';
import { Brochure } from '@domain/core/brochure/brochure.entity';
import { BrochureTranslation } from '@domain/core/brochure/brochure-translation.entity';
import { ElectronicDisclosure } from '@domain/core/electronic-disclosure/electronic-disclosure.entity';
import { ElectronicDisclosureTranslation } from '@domain/core/electronic-disclosure/electronic-disclosure-translation.entity';
import { IR } from '@domain/core/ir/ir.entity';
import { IRTranslation } from '@domain/core/ir/ir-translation.entity';
import { ShareholdersMeeting } from '@domain/core/shareholders-meeting/shareholders-meeting.entity';
import { ShareholdersMeetingTranslation } from '@domain/core/shareholders-meeting/shareholders-meeting-translation.entity';
import { MainPopup } from '@domain/sub/main-popup/main-popup.entity';
import { MainPopupTranslation } from '@domain/sub/main-popup/main-popup-translation.entity';
import { LumirStory } from '@domain/sub/lumir-story/lumir-story.entity';
import { VideoGallery } from '@domain/sub/video-gallery/video-gallery.entity';
import { WikiFileSystem } from '@domain/sub/wiki-file-system/wiki-file-system.entity';
import { Survey } from '@domain/sub/survey/survey.entity';
import { SurveyQuestion } from '@domain/sub/survey/survey-question.entity';
import { SurveyCompletion } from '@domain/sub/survey/survey-completion.entity';
import { SurveyResponseChoice } from '@domain/sub/survey/responses/survey-response-choice.entity';
import { SurveyResponseCheckbox } from '@domain/sub/survey/responses/survey-response-checkbox.entity';
import { SurveyResponseScale } from '@domain/sub/survey/responses/survey-response-scale.entity';
import { SurveyResponseText } from '@domain/sub/survey/responses/survey-response-text.entity';

// Domain Modules
import { LanguageModule } from '@domain/common/language/language.module';
import { CategoryModule } from '@domain/common/category/category.module';
import { AnnouncementModule } from '@domain/core/announcement/announcement.module';
import { NewsModule } from '@domain/core/news/news.module';
import { BrochureModule } from '@domain/core/brochure/brochure.module';
import { ElectronicDisclosureModule } from '@domain/core/electronic-disclosure/electronic-disclosure.module';
import { IRModule } from '@domain/core/ir/ir.module';
import { ShareholdersMeetingModule } from '@domain/core/shareholders-meeting/shareholders-meeting.module';
import { MainPopupModule } from '@domain/sub/main-popup/main-popup.module';
import { LumirStoryModule } from '@domain/sub/lumir-story/lumir-story.module';
import { VideoGalleryModule } from '@domain/sub/video-gallery/video-gallery.module';
import { WikiFileSystemModule } from '@domain/sub/wiki-file-system/wiki-file-system.module';
import { SurveyModule } from '@domain/sub/survey/survey.module';

// Context Modules
import { CompanyContextModule } from '@context/company-context';
import { BrochureContextModule } from '@context/brochure-context/brochure-context.module';
import { ElectronicDisclosureContextModule } from '@context/electronic-disclosure-context/electronic-disclosure-context.module';
import { IRContextModule } from '@context/ir-context/ir-context.module';
import { ShareholdersMeetingContextModule } from '@context/shareholders-meeting-context/shareholders-meeting-context.module';
import { MainPopupContextModule } from '@context/main-popup-context/main-popup-context.module';
import { LumirStoryContextModule } from '@context/lumir-story-context/lumir-story-context.module';
import { VideoGalleryContextModule } from '@context/video-gallery-context/video-gallery-context.module';
import { WikiContextModule } from '@context/wiki-context/wiki-context.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Common
      Language,
      Category,
      // Core
      Announcement,
      AnnouncementRead,
      News,
      Brochure,
      BrochureTranslation,
      ElectronicDisclosure,
      ElectronicDisclosureTranslation,
      IR,
      IRTranslation,
      ShareholdersMeeting,
      ShareholdersMeetingTranslation,
      // Sub
      MainPopup,
      MainPopupTranslation,
      LumirStory,
      VideoGallery,
      WikiFileSystem,
      Survey,
      SurveyQuestion,
      SurveyCompletion,
      SurveyResponseChoice,
      SurveyResponseCheckbox,
      SurveyResponseScale,
      SurveyResponseText,
    ]),
    // Domain Modules
    LanguageModule,
    CategoryModule,
    AnnouncementModule,
    NewsModule,
    BrochureModule,
    ElectronicDisclosureModule,
    IRModule,
    ShareholdersMeetingModule,
    MainPopupModule,
    LumirStoryModule,
    VideoGalleryModule,
    WikiFileSystemModule,
    SurveyModule,
    // Context Modules
    CompanyContextModule,
    BrochureContextModule,
    ElectronicDisclosureContextModule,
    IRContextModule,
    ShareholdersMeetingContextModule,
    MainPopupContextModule,
    LumirStoryContextModule,
    VideoGalleryContextModule,
    WikiContextModule,
  ],
  providers: [SeedDataContextService],
  exports: [SeedDataContextService],
})
export class SeedDataContextModule {}
