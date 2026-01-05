import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetElectronicNoticeQuery } from '../../queries/get-electronic-notice.query';
import { ElectronicNoticeService } from '@business/electronic-notice/electronic-notice.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { ElectronicDisclosureDto } from '@domain/core/electronic-disclosure/electronic-disclosure.types';

@QueryHandler(GetElectronicNoticeQuery)
export class GetElectronicNoticeHandler
  implements IQueryHandler<GetElectronicNoticeQuery>
{
  constructor(
    private readonly noticeService: ElectronicNoticeService,
  ) {}

  async execute(
    query: GetElectronicNoticeQuery,
  ): Promise<ApiResponse<ElectronicDisclosureDto>> {
    return this.noticeService.전자공시를_조회_한다(query.noticeId);
  }
}
