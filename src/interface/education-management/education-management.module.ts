import { Module } from '@nestjs/common';
import { EducationManagementController } from './education-management.controller';
import { EducationManagementBusinessModule } from '@business/education-management';

@Module({
  imports: [EducationManagementBusinessModule],
  controllers: [EducationManagementController],
})
export class EducationManagementModule {}
