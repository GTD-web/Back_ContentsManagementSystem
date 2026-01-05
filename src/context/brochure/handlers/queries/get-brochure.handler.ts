import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBrochureQuery } from '../../queries/get-brochure.query';
import { BrochureService } from '@business/brochure/brochure.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { BrochureDto } from '@domain/core/brochure/brochure.types';

@QueryHandler(GetBrochureQuery)
export class GetBrochureHandler implements IQueryHandler<GetBrochureQuery> {
  constructor(private readonly brochureService: BrochureService) {}

  async execute(query: GetBrochureQuery): Promise<ApiResponse<BrochureDto>> {
    return this.brochureService.브로슈어를_조회_한다(query.brochureId);
  }
}
