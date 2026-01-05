import { Module } from '@nestjs/common';
import { SurveyController } from './survey.controller';

@Module({
  controllers: [SurveyController],
})
export class SurveyInterfaceModule {}
