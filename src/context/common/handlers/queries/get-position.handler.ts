import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPositionQuery } from '../../queries/get-position.query';
import { PositionService } from '@business/common/position.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { PositionDto } from '@domain/common/position/position.types';

/**
 * 직책 상세 조회 쿼리 핸들러
 */
@QueryHandler(GetPositionQuery)
export class GetPositionHandler implements IQueryHandler<GetPositionQuery> {
  constructor(private readonly positionService: PositionService) {}

  async execute(query: GetPositionQuery): Promise<ApiResponse<PositionDto>> {
    return this.positionService.직책을_조회_한다(query.positionId);
  }
}
