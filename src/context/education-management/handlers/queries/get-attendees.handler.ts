import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAttendeesQuery } from '../../queries/get-attendees.query';
import { EducationManagementService } from '@business/education-management/education-management.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { Attendee } from '@domain/sub/education-management/education-management.types';

@QueryHandler(GetAttendeesQuery)
export class GetAttendeesHandler implements IQueryHandler<GetAttendeesQuery> {
  constructor(private readonly educationService: EducationManagementService) {}

  async execute(
    query: GetAttendeesQuery,
  ): Promise<ApiResponse<Attendee[]>> {
    return this.educationService.수강_직원_목록을_조회_한다(query.educationId);
  }
}
