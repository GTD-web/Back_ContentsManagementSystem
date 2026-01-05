import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllPositionsQuery } from '../../queries/get-all-positions.query';
import { PositionService } from '@business/common/position.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { PositionDto } from '@domain/common/position/position.types';

/**
 * 직책 목록 조회 쿼리 핸들러
 */
@QueryHandler(GetAllPositionsQuery)
export class GetAllPositionsHandler
  implements IQueryHandler<GetAllPositionsQuery>
{
  constructor(private readonly positionService: PositionService) {}

  async execute(
    query: GetAllPositionsQuery,
  ): Promise<ApiResponse<PositionDto[]>> {
    return this.positionService.직책_목록을_조회_한다();
  }
}
