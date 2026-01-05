import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EducationManagement } from '@domain/sub/education-management/education-management.entity';
import { EducationManagementService } from './education-management.service';

/**
 * 교육 관리 비즈니스 모듈
 *
 * @description
 * - 교육 관리 관련 비즈니스 서비스를 제공합니다.
 */
@Module({
  imports: [TypeOrmModule.forFeature([EducationManagement])],
  providers: [EducationManagementService],
  exports: [EducationManagementService],
})
export class EducationManagementBusinessModule {}
