import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAnnouncementPopupQuery } from '../../queries/get-announcement-popup.query';
import { AnnouncementPopupService } from '@business/announcement-popup/announcement-popup.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { AnnouncementPopupDto } from '@domain/core/announcement-popup/announcement-popup.types';

@QueryHandler(GetAnnouncementPopupQuery)
export class GetAnnouncementPopupHandler
  implements IQueryHandler<GetAnnouncementPopupQuery>
{
  constructor(
    private readonly popupService: AnnouncementPopupService,
  ) {}

  async execute(
    query: GetAnnouncementPopupQuery,
  ): Promise<ApiResponse<AnnouncementPopupDto>> {
    return this.popupService.팝업을_조회_한다(query.popupId);
  }
}
