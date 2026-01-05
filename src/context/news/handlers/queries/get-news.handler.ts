import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetNewsQuery } from '../../queries/get-news.query';
import { NewsService } from '@business/news/news.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { NewsDto } from '@domain/core/news/news.types';

/**
 * 뉴스 상세 조회 쿼리 핸들러
 */
@QueryHandler(GetNewsQuery)
export class GetNewsHandler implements IQueryHandler<GetNewsQuery> {
  constructor(private readonly newsService: NewsService) {}

  async execute(query: GetNewsQuery): Promise<ApiResponse<NewsDto>> {
    return this.newsService.뉴스를_조회_한다(query.newsId);
  }
}
