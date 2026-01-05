import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllWikisQuery } from '../../queries/get-all-wikis.query';
import { WikiService } from '@business/wiki/wiki.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { WikiDto } from '@domain/sub/wiki/wiki.types';

@QueryHandler(GetAllWikisQuery)
export class GetAllWikisHandler implements IQueryHandler<GetAllWikisQuery> {
  constructor(private readonly wikiService: WikiService) {}

  async execute(query: GetAllWikisQuery): Promise<ApiResponse<WikiDto[]>> {
    return this.wikiService.위키_목록을_조회_한다(query.filters);
  }
}
