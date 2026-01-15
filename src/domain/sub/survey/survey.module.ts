import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from './survey.entity';
import { SurveyQuestion } from './survey-question.entity';
import { SurveyCompletion } from './survey-completion.entity';
import { SurveyService } from './survey.service';

/**
 * 설문조사 모듈
 * 설문조사 관리 기능을 제공합니다.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Survey, SurveyQuestion, SurveyCompletion]),
  ],
  providers: [SurveyService],
  exports: [SurveyService],
})
export class SurveyModule {}
