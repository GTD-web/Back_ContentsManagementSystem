import { Module } from '@nestjs/common';
import { SurveyController } from './survey.controller';
import { SurveyBusinessModule } from '@business/survey';

@Module({
  imports: [SurveyBusinessModule],
  controllers: [SurveyController],
})
export class SurveyInterfaceModule {}
