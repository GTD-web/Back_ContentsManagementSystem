import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLumirStoryQuery } from '../../queries/get-lumir-story.query';
import { LumirStoryService } from '@business/lumir-story/lumir-story.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { LumirStoryDto } from '@domain/sub/lumir-story/lumir-story.types';

@QueryHandler(GetLumirStoryQuery)
export class GetLumirStoryHandler implements IQueryHandler<GetLumirStoryQuery> {
  constructor(private readonly storyService: LumirStoryService) {}

  async execute(query: GetLumirStoryQuery): Promise<ApiResponse<LumirStoryDto>> {
    return this.storyService.루미르_스토리를_조회_한다(query.storyId);
  }
}
