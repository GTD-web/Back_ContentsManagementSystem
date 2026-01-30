import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from '@domain/common/language/language.entity';
import { LanguageModule } from '@domain/common/language/language.module';
import { BrochureModule } from '@domain/core/brochure/brochure.module';
import { BrochureTranslation } from '@domain/core/brochure/brochure-translation.entity';
import { ElectronicDisclosureModule } from '@domain/core/electronic-disclosure/electronic-disclosure.module';
import { ElectronicDisclosureTranslation } from '@domain/core/electronic-disclosure/electronic-disclosure-translation.entity';
import { IRModule } from '@domain/core/ir/ir.module';
import { IRTranslation } from '@domain/core/ir/ir-translation.entity';
import { MainPopupModule } from '@domain/sub/main-popup/main-popup.module';
import { MainPopupTranslation } from '@domain/sub/main-popup/main-popup-translation.entity';
import { ShareholdersMeetingModule } from '@domain/core/shareholders-meeting/shareholders-meeting.module';
import { ShareholdersMeetingTranslation } from '@domain/core/shareholders-meeting/shareholders-meeting-translation.entity';
import { LanguageContextService } from './language-context.service';
import { TranslationSyncTriggerService } from './translation-sync-trigger.service';
import { BrochureContextModule } from '@context/brochure-context/brochure-context.module';
import { ElectronicDisclosureContextModule } from '@context/electronic-disclosure-context/electronic-disclosure-context.module';
import { IRContextModule } from '@context/ir-context/ir-context.module';
import { MainPopupContextModule } from '@context/main-popup-context/main-popup-context.module';
import { ShareholdersMeetingContextModule } from '@context/shareholders-meeting-context/shareholders-meeting-context.module';
import {
  CreateLanguageHandler,
  UpdateLanguageHandler,
  UpdateLanguageActiveHandler,
  UpdateLanguageOrderHandler,
  DeleteLanguageHandler,
  GetLanguageListHandler,
  GetLanguageDetailHandler,
  InitializeDefaultLanguagesHandler,
} from './handlers';

/**
 * 언어 컨텍스트 모듈
 *
 * 언어 생성, 수정, 삭제 및 조회 비즈니스 로직을 담당합니다.
 */
@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      Language,
      BrochureTranslation,
      ElectronicDisclosureTranslation,
      IRTranslation,
      MainPopupTranslation,
      ShareholdersMeetingTranslation,
    ]),
    LanguageModule,
    BrochureModule,
    ElectronicDisclosureModule,
    IRModule,
    MainPopupModule,
    ShareholdersMeetingModule,
    BrochureContextModule,
    ElectronicDisclosureContextModule,
    IRContextModule,
    MainPopupContextModule,
    ShareholdersMeetingContextModule,
  ],
  providers: [
    LanguageContextService,
    TranslationSyncTriggerService,
    CreateLanguageHandler,
    UpdateLanguageHandler,
    UpdateLanguageActiveHandler,
    UpdateLanguageOrderHandler,
    DeleteLanguageHandler,
    GetLanguageListHandler,
    GetLanguageDetailHandler,
    InitializeDefaultLanguagesHandler,
  ],
  exports: [LanguageContextService],
})
export class LanguageContextModule {}
