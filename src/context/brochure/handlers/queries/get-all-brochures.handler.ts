import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllBrochuresQuery } from '../../queries/get-all-brochures.query';
import { BrochureService } from '@business/brochure/brochure.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { BrochureDto } from '@domain/core/brochure/brochure.types';

@QueryHandler(GetAllBrochuresQuery)
export class GetAllBrochuresHandler
  implements IQueryHandler<GetAllBrochuresQuery>
{
  constructor(private readonly brochureService: BrochureService) {}

  async execute(
    query: GetAllBrochuresQuery,
  ): Promise<ApiResponse<BrochureDto[]>> {
    return this.brochureService.브로슈어_목록을_조회_한다(query.code);
  }
}
