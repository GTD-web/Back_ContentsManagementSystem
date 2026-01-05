import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetRankQuery } from '../../queries/get-rank.query';
import { RankService } from '@business/common/rank.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { RankDto } from '@domain/common/rank/rank.types';

/**
 * 직급 상세 조회 쿼리 핸들러
 */
@QueryHandler(GetRankQuery)
export class GetRankHandler implements IQueryHandler<GetRankQuery> {
  constructor(private readonly rankService: RankService) {}

  async execute(query: GetRankQuery): Promise<ApiResponse<RankDto>> {
    return this.rankService.직급을_조회_한다(query.rankId);
  }
}
