import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAnnouncementQuery } from '../../queries/get-announcement.query';
import { AnnouncementService } from '@business/announcement/announcement.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { AnnouncementDto } from '@domain/core/announcement/announcement.types';

@QueryHandler(GetAnnouncementQuery)
export class GetAnnouncementHandler
  implements IQueryHandler<GetAnnouncementQuery>
{
  constructor(private readonly announcementService: AnnouncementService) {}

  async execute(
    query: GetAnnouncementQuery,
  ): Promise<ApiResponse<AnnouncementDto>> {
    return this.announcementService.공지사항을_조회_한다(query.announcementId);
  }
}
