import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllNewsQuery } from '../../queries/get-all-news.query';
import { NewsService } from '@business/news/news.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { NewsDto } from '@domain/core/news/news.types';

/**
 * 뉴스 목록 조회 쿼리 핸들러
 */
@QueryHandler(GetAllNewsQuery)
export class GetAllNewsHandler implements IQueryHandler<GetAllNewsQuery> {
  constructor(private readonly newsService: NewsService) {}

  async execute(query: GetAllNewsQuery): Promise<ApiResponse<NewsDto[]>> {
    return this.newsService.뉴스_목록을_조회_한다(query.code);
  }
}
