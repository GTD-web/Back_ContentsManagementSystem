import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllEmployeesQuery } from '../../queries/get-all-employees.query';
import { EmployeeService } from '@business/common/employee.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { EmployeeDto } from '@domain/common/employee/employee.types';

/**
 * 직원 목록 조회 쿼리 핸들러
 */
@QueryHandler(GetAllEmployeesQuery)
export class GetAllEmployeesHandler
  implements IQueryHandler<GetAllEmployeesQuery>
{
  constructor(private readonly employeeService: EmployeeService) {}

  async execute(
    query: GetAllEmployeesQuery,
  ): Promise<ApiResponse<EmployeeDto[]>> {
    return this.employeeService.직원_목록을_조회_한다();
  }
}
