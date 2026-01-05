import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetEmployeeQuery } from '../../queries/get-employee.query';
import { EmployeeService } from '@business/common/employee.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { EmployeeDto } from '@domain/common/employee/employee.types';

/**
 * 직원 상세 조회 쿼리 핸들러
 */
@QueryHandler(GetEmployeeQuery)
export class GetEmployeeHandler implements IQueryHandler<GetEmployeeQuery> {
  constructor(private readonly employeeService: EmployeeService) {}

  async execute(query: GetEmployeeQuery): Promise<ApiResponse<EmployeeDto>> {
    return this.employeeService.직원을_조회_한다(query.employeeId);
  }
}
