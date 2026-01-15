import { Module } from '@nestjs/common';
import { SurveyController } from './survey.controller';
import { SurveyBusinessModule } from '@business/survey-business/survey-business.module';

/**
 * 설문조사 인터페이스 모듈 (관리자)
 */
@Module({
  imports: [SurveyBusinessModule],
  controllers: [SurveyController],
})
export class SurveyAdminModule {}
