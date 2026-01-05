import { Module } from '@nestjs/common';
import { EducationManagementController } from './education-management.controller';

@Module({
  controllers: [EducationManagementController],
  providers: [],
})
export class EducationManagementModule {}
