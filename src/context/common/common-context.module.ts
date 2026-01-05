import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommonBusinessModule } from '@business/common';

// Command Handlers
import { CreateEmployeeHandler } from './handlers/commands/create-employee.handler';
import { UpdateEmployeeHandler } from './handlers/commands/update-employee.handler';
import { DeleteEmployeeHandler } from './handlers/commands/delete-employee.handler';
import { SendNotificationHandler } from './handlers/commands/send-notification.handler';

// Query Handlers
import { GetAllEmployeesHandler } from './handlers/queries/get-all-employees.handler';
import { GetEmployeeHandler } from './handlers/queries/get-employee.handler';
import { GetAllDepartmentsHandler } from './handlers/queries/get-all-departments.handler';
import { GetDepartmentHandler } from './handlers/queries/get-department.handler';
import { GetAllPositionsHandler } from './handlers/queries/get-all-positions.handler';
import { GetPositionHandler } from './handlers/queries/get-position.handler';
import { GetAllRanksHandler } from './handlers/queries/get-all-ranks.handler';
import { GetRankHandler } from './handlers/queries/get-rank.handler';
import { GetOrganizationHierarchyHandler } from './handlers/queries/get-organization-hierarchy.handler';

const CommandHandlers = [
  CreateEmployeeHandler,
  UpdateEmployeeHandler,
  DeleteEmployeeHandler,
  SendNotificationHandler,
];

const QueryHandlers = [
  GetAllEmployeesHandler,
  GetEmployeeHandler,
  GetAllDepartmentsHandler,
  GetDepartmentHandler,
  GetAllPositionsHandler,
  GetPositionHandler,
  GetAllRanksHandler,
  GetRankHandler,
  GetOrganizationHierarchyHandler,
];

/**
 * 공통 모듈 Context Layer
 *
 * @description
 * - CQRS 패턴을 사용하여 Command와 Query를 분리합니다.
 * - 직원, 부서, 직책, 직급, 조직, 알림 관련 Command/Query를 처리합니다.
 */
@Module({
  imports: [CqrsModule, CommonBusinessModule],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [CqrsModule],
})
export class CommonContextModule {}
