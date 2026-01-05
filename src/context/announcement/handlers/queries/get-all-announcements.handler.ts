import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllAnnouncementsQuery } from '../../queries/get-all-announcements.query';
import { AnnouncementService } from '@business/announcement/announcement.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { AnnouncementDto } from '@domain/core/announcement/announcement.types';

@QueryHandler(GetAllAnnouncementsQuery)
export class GetAllAnnouncementsHandler
  implements IQueryHandler<GetAllAnnouncementsQuery>
{
  constructor(private readonly announcementService: AnnouncementService) {}

  async execute(
    query: GetAllAnnouncementsQuery,
  ): Promise<ApiResponse<AnnouncementDto[]>> {
    return this.announcementService.공지사항_목록을_조회_한다(query.filters);
  }
}
