import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from './survey.entity';
import { SurveyQuestion } from './survey-question.entity';
import { SurveyCompletion } from './survey-completion.entity';
import { SurveyResponseText } from './responses/survey-response-text.entity';
import { SurveyResponseChoice } from './responses/survey-response-choice.entity';
import { SurveyResponseCheckbox } from './responses/survey-response-checkbox.entity';
import { SurveyResponseScale } from './responses/survey-response-scale.entity';
import { SurveyResponseGrid } from './responses/survey-response-grid.entity';
import { SurveyResponseFile } from './responses/survey-response-file.entity';
import { SurveyResponseDatetime } from './responses/survey-response-datetime.entity';
import { SurveyService } from './survey.service';
import { StorageModule } from '@libs/storage/storage.module';

/**
 * 설문조사 모듈
 * 설문조사 관리 기능을 제공합니다.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Survey,
      SurveyQuestion,
      SurveyCompletion,
      SurveyResponseText,
      SurveyResponseChoice,
      SurveyResponseCheckbox,
      SurveyResponseScale,
      SurveyResponseGrid,
      SurveyResponseFile,
      SurveyResponseDatetime,
    ]),
    StorageModule,
  ],
  providers: [SurveyService],
  exports: [SurveyService],
})
export class SurveyModule {}
