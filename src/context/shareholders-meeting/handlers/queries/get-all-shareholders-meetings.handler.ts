import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllShareholdersMeetingsQuery } from '../../queries/get-all-shareholders-meetings.query';
import { ShareholdersMeetingService } from '@business/shareholders-meeting/shareholders-meeting.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { ShareholdersMeetingDto } from '@domain/core/shareholders-meeting/shareholders-meeting.types';

@QueryHandler(GetAllShareholdersMeetingsQuery)
export class GetAllShareholdersMeetingsHandler
  implements IQueryHandler<GetAllShareholdersMeetingsQuery>
{
  constructor(
    private readonly meetingService: ShareholdersMeetingService,
  ) {}

  async execute(
    query: GetAllShareholdersMeetingsQuery,
  ): Promise<ApiResponse<ShareholdersMeetingDto[]>> {
    return this.meetingService.주주총회_목록을_조회_한다(query.code);
  }
}
