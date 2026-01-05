import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from '@domain/sub/survey/survey.entity';
import { SurveyService } from './survey.service';

/**
 * 설문조사 비즈니스 모듈
 *
 * @description
 * - 설문조사 관련 비즈니스 서비스를 제공합니다.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Survey])],
  providers: [SurveyService],
  exports: [SurveyService],
})
export class SurveyBusinessModule {}
