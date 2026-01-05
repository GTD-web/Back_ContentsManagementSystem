import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDepartmentQuery } from '../../queries/get-department.query';
import { DepartmentService } from '@business/common/department.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { DepartmentDto } from '@domain/common/department/department.types';

/**
 * 부서 상세 조회 쿼리 핸들러
 */
@QueryHandler(GetDepartmentQuery)
export class GetDepartmentHandler
  implements IQueryHandler<GetDepartmentQuery>
{
  constructor(private readonly departmentService: DepartmentService) {}

  async execute(
    query: GetDepartmentQuery,
  ): Promise<ApiResponse<DepartmentDto>> {
    return this.departmentService.부서를_조회_한다(query.departmentId);
  }
}
