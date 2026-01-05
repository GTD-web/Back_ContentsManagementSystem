import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetEducationQuery } from '../../queries/get-education.query';
import { EducationManagementService } from '@business/education-management/education-management.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { EducationManagementDto } from '@domain/sub/education-management/education-management.types';

@QueryHandler(GetEducationQuery)
export class GetEducationHandler implements IQueryHandler<GetEducationQuery> {
  constructor(private readonly educationService: EducationManagementService) {}

  async execute(
    query: GetEducationQuery,
  ): Promise<ApiResponse<EducationManagementDto>> {
    return this.educationService.교육을_조회_한다(query.educationId);
  }
}
