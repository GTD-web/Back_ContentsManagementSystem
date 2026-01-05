import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllRanksQuery } from '../../queries/get-all-ranks.query';
import { RankService } from '@business/common/rank.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { RankDto } from '@domain/common/rank/rank.types';

/**
 * 직급 목록 조회 쿼리 핸들러
 */
@QueryHandler(GetAllRanksQuery)
export class GetAllRanksHandler implements IQueryHandler<GetAllRanksQuery> {
  constructor(private readonly rankService: RankService) {}

  async execute(query: GetAllRanksQuery): Promise<ApiResponse<RankDto[]>> {
    return this.rankService.직급_목록을_조회_한다();
  }
}
