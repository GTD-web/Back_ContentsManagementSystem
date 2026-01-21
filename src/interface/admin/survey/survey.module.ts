import { Module } from '@nestjs/common';
import { AuthContextModule } from '@context/auth-context';
import { SurveyController } from './survey.controller';
import { SurveyBusinessModule } from '@business/survey-business/survey-business.module';

/**
 * 설문조사 인터페이스 모듈 (관리자)
 */
@Module({
  imports: [AuthContextModule, SurveyBusinessModule],
  controllers: [SurveyController],
})
export class SurveyAdminModule {}
