import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetIRQuery } from '../../queries/get-ir.query';
import { IRService } from '@business/ir/ir.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { IRDto } from '@domain/core/ir/ir.types';

@QueryHandler(GetIRQuery)
export class GetIRHandler implements IQueryHandler<GetIRQuery> {
  constructor(private readonly irService: IRService) {}

  async execute(query: GetIRQuery): Promise<ApiResponse<IRDto>> {
    return this.irService.IR을_조회_한다(query.irId);
  }
}
