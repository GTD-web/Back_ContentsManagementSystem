import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllIRQuery } from '../../queries/get-all-ir.query';
import { IRService } from '@business/ir/ir.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { IRDto } from '@domain/core/ir/ir.types';

@QueryHandler(GetAllIRQuery)
export class GetAllIRHandler implements IQueryHandler<GetAllIRQuery> {
  constructor(private readonly irService: IRService) {}

  async execute(query: GetAllIRQuery): Promise<ApiResponse<IRDto[]>> {
    return this.irService.IR_목록을_조회_한다(query.code);
  }
}
