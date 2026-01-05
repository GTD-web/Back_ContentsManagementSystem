import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnpublishIRCommand } from '../../commands/unpublish-ir.command';
import { IRService } from '@business/ir/ir.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { IRDto } from '@domain/core/ir/ir.types';

@CommandHandler(UnpublishIRCommand)
export class UnpublishIRHandler implements ICommandHandler<UnpublishIRCommand> {
  constructor(private readonly irService: IRService) {}

  async execute(command: UnpublishIRCommand): Promise<ApiResponse<IRDto>> {
    return this.irService.IR을_비공개_한다(command.irId);
  }
}
