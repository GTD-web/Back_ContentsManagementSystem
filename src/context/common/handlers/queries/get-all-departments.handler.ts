import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllDepartmentsQuery } from '../../queries/get-all-departments.query';
import { DepartmentService } from '@business/common/department.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { DepartmentDto } from '@domain/common/department/department.types';

/**
 * 부서 목록 조회 쿼리 핸들러
 */
@QueryHandler(GetAllDepartmentsQuery)
export class GetAllDepartmentsHandler
  implements IQueryHandler<GetAllDepartmentsQuery>
{
  constructor(private readonly departmentService: DepartmentService) {}

  async execute(
    query: GetAllDepartmentsQuery,
  ): Promise<ApiResponse<DepartmentDto[]>> {
    return this.departmentService.부서_목록을_조회_한다();
  }
}
