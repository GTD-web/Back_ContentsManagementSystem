import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PublishIRCommand } from '../../commands/publish-ir.command';
import { IRService } from '@business/ir/ir.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { IRDto } from '@domain/core/ir/ir.types';

@CommandHandler(PublishIRCommand)
export class PublishIRHandler implements ICommandHandler<PublishIRCommand> {
  constructor(private readonly irService: IRService) {}

  async execute(command: PublishIRCommand): Promise<ApiResponse<IRDto>> {
    return this.irService.IR을_공개_한다(command.irId);
  }
}
