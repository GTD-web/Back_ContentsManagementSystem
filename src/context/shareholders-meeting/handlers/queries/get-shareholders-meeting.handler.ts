import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetShareholdersMeetingQuery } from '../../queries/get-shareholders-meeting.query';
import { ShareholdersMeetingService } from '@business/shareholders-meeting/shareholders-meeting.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { ShareholdersMeetingDto } from '@domain/core/shareholders-meeting/shareholders-meeting.types';

@QueryHandler(GetShareholdersMeetingQuery)
export class GetShareholdersMeetingHandler
  implements IQueryHandler<GetShareholdersMeetingQuery>
{
  constructor(
    private readonly meetingService: ShareholdersMeetingService,
  ) {}

  async execute(
    query: GetShareholdersMeetingQuery,
  ): Promise<ApiResponse<ShareholdersMeetingDto>> {
    return this.meetingService.주주총회를_조회_한다(query.meetingId);
  }
}
