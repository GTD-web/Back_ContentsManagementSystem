import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllEducationsQuery } from '../../queries/get-all-educations.query';
import { EducationManagementService } from '@business/education-management/education-management.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { EducationManagementDto } from '@domain/sub/education-management/education-management.types';

@QueryHandler(GetAllEducationsQuery)
export class GetAllEducationsHandler
  implements IQueryHandler<GetAllEducationsQuery>
{
  constructor(private readonly educationService: EducationManagementService) {}

  async execute(
    query: GetAllEducationsQuery,
  ): Promise<ApiResponse<EducationManagementDto[]>> {
    return this.educationService.교육_목록을_조회_한다(query.filters);
  }
}
