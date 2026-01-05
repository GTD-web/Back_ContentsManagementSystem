import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllAnnouncementPopupsQuery } from '../../queries/get-all-announcement-popups.query';
import { AnnouncementPopupService } from '@business/announcement-popup/announcement-popup.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { AnnouncementPopupDto } from '@domain/core/announcement-popup/announcement-popup.types';

@QueryHandler(GetAllAnnouncementPopupsQuery)
export class GetAllAnnouncementPopupsHandler
  implements IQueryHandler<GetAllAnnouncementPopupsQuery>
{
  constructor(
    private readonly popupService: AnnouncementPopupService,
  ) {}

  async execute(
    query: GetAllAnnouncementPopupsQuery,
  ): Promise<ApiResponse<AnnouncementPopupDto[]>> {
    return this.popupService.팝업_목록을_조회_한다();
  }
}
