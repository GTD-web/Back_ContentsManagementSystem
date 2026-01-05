import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetWikiQuery } from '../../queries/get-wiki.query';
import { WikiService } from '@business/wiki/wiki.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { WikiDto } from '@domain/sub/wiki/wiki.types';

@QueryHandler(GetWikiQuery)
export class GetWikiHandler implements IQueryHandler<GetWikiQuery> {
  constructor(private readonly wikiService: WikiService) {}

  async execute(query: GetWikiQuery): Promise<ApiResponse<WikiDto>> {
    return this.wikiService.위키를_조회_한다(query.wikiId);
  }
}
