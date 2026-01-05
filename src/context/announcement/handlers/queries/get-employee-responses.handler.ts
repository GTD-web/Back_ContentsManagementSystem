import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetEmployeeResponsesQuery } from '../../queries/get-employee-responses.query';
import { AnnouncementService } from '@business/announcement/announcement.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { AnnouncementEmployee } from '@domain/core/announcement/announcement-employee.types';

@QueryHandler(GetEmployeeResponsesQuery)
export class GetEmployeeResponsesHandler
  implements IQueryHandler<GetEmployeeResponsesQuery>
{
  constructor(private readonly announcementService: AnnouncementService) {}

  async execute(
    query: GetEmployeeResponsesQuery,
  ): Promise<ApiResponse<AnnouncementEmployee[]>> {
    return this.announcementService.직원_응답_목록을_조회_한다(
      query.announcementId,
    );
  }
}
