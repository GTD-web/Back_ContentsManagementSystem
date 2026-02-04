import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyModule } from '@domain/sub/survey/survey.module';
import { Survey } from '@domain/sub/survey/survey.entity';
import { SurveyQuestion } from '@domain/sub/survey/survey-question.entity';
import { SurveyCompletion } from '@domain/sub/survey/survey-completion.entity';
import { SurveyResponseChoice } from '@domain/sub/survey/responses/survey-response-choice.entity';
import { SurveyResponseCheckbox } from '@domain/sub/survey/responses/survey-response-checkbox.entity';
import { SurveyResponseScale } from '@domain/sub/survey/responses/survey-response-scale.entity';
import { SurveyResponseText } from '@domain/sub/survey/responses/survey-response-text.entity';
import { SurveyResponseFile } from '@domain/sub/survey/responses/survey-response-file.entity';
import { SurveyResponseDatetime } from '@domain/sub/survey/responses/survey-response-datetime.entity';
import { SurveyResponseGrid } from '@domain/sub/survey/responses/survey-response-grid.entity';
import { SurveyContextService } from './survey-context.service';
import { SurveyHandlers } from './handlers';

/**
 * 설문조사 컨텍스트 모듈
 *
 * 설문조사 관련 CQRS 패턴 구현을 담당합니다.
 */
@Module({
  imports: [
    CqrsModule,
    SurveyModule,
    TypeOrmModule.forFeature([
      Survey,
      SurveyQuestion,
      SurveyCompletion,
      SurveyResponseChoice,
      SurveyResponseCheckbox,
      SurveyResponseScale,
      SurveyResponseText,
      SurveyResponseFile,
      SurveyResponseDatetime,
      SurveyResponseGrid,
    ]),
  ],
  providers: [SurveyContextService, ...SurveyHandlers],
  exports: [SurveyContextService],
})
export class SurveyContextModule {}
