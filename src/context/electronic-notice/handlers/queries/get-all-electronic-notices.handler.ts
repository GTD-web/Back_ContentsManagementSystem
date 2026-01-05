import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllElectronicNoticesQuery } from '../../queries/get-all-electronic-notices.query';
import { ElectronicNoticeService } from '@business/electronic-notice/electronic-notice.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { ElectronicDisclosureDto } from '@domain/core/electronic-disclosure/electronic-disclosure.types';

@QueryHandler(GetAllElectronicNoticesQuery)
export class GetAllElectronicNoticesHandler
  implements IQueryHandler<GetAllElectronicNoticesQuery>
{
  constructor(
    private readonly noticeService: ElectronicNoticeService,
  ) {}

  async execute(
    query: GetAllElectronicNoticesQuery,
  ): Promise<ApiResponse<ElectronicDisclosureDto[]>> {
    return this.noticeService.전자공시_목록을_조회_한다(query.code);
  }
}
