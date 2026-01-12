import { Module } from '@nestjs/common';
import { ShareholdersMeetingModule } from '@domain/core/shareholders-meeting/shareholders-meeting.module';
import { LanguageModule } from '@domain/common/language/language.module';
import { ShareholdersMeetingContextService } from './shareholders-meeting-context.service';

/**
 * 주주총회 컨텍스트 모듈
 */
@Module({
  imports: [ShareholdersMeetingModule, LanguageModule],
  providers: [ShareholdersMeetingContextService],
  exports: [ShareholdersMeetingContextService],
})
export class ShareholdersMeetingContextModule {}
