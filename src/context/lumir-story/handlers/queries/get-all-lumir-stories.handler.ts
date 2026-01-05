import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllLumirStoriesQuery } from '../../queries/get-all-lumir-stories.query';
import { LumirStoryService } from '@business/lumir-story/lumir-story.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { LumirStoryDto } from '@domain/sub/lumir-story/lumir-story.types';

@QueryHandler(GetAllLumirStoriesQuery)
export class GetAllLumirStoriesHandler
  implements IQueryHandler<GetAllLumirStoriesQuery>
{
  constructor(private readonly storyService: LumirStoryService) {}

  async execute(
    query: GetAllLumirStoriesQuery,
  ): Promise<ApiResponse<LumirStoryDto[]>> {
    return this.storyService.루미르_스토리_목록을_조회_한다(query.code);
  }
}
