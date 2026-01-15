import { Module } from '@nestjs/common';
import { SurveyBusinessService } from './survey-business.service';
import { SurveyContextModule } from '@context/survey-context/survey-context.module';

/**
 * 설문조사 비즈니스 모듈
 *
 * 설문조사 관련 비즈니스 로직을 오케스트레이션합니다.
 */
@Module({
  imports: [SurveyContextModule],
  providers: [SurveyBusinessService],
  exports: [SurveyBusinessService],
})
export class SurveyBusinessModule {}
