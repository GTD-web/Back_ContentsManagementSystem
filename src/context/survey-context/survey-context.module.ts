import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SurveyModule } from '@domain/sub/survey/survey.module';
import { SurveyContextService } from './survey-context.service';
import { SurveyHandlers } from './handlers';

/**
 * 설문조사 컨텍스트 모듈
 *
 * 설문조사 관련 CQRS 패턴 구현을 담당합니다.
 */
@Module({
  imports: [CqrsModule, SurveyModule],
  providers: [SurveyContextService, ...SurveyHandlers],
  exports: [SurveyContextService],
})
export class SurveyContextModule {}
