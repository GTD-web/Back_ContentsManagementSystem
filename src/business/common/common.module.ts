import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '@domain/common/employee/employee.entity';
import { Department } from '@domain/common/department/department.entity';
import { EmployeeService } from './employee.service';
import { DepartmentService } from './department.service';
import { PositionService } from './position.service';
import { RankService } from './rank.service';
import { NotificationService } from './notification.service';
import { OrganizationService } from './organization.service';

/**
 * 공통 비즈니스 모듈
 *
 * @description
 * - 직원, 부서, 직급, 직책, 알림, 조직 하이라키 관련 비즈니스 서비스를 제공합니다.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Employee, Department])],
  providers: [
    EmployeeService,
    DepartmentService,
    PositionService,
    RankService,
    NotificationService,
    OrganizationService,
  ],
  exports: [
    EmployeeService,
    DepartmentService,
    PositionService,
    RankService,
    NotificationService,
    OrganizationService,
  ],
})
export class CommonBusinessModule {}
