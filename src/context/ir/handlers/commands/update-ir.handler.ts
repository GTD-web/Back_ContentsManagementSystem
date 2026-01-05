import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateIRCommand } from '../../commands/update-ir.command';
import { IRService } from '@business/ir/ir.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { IRDto } from '@domain/core/ir/ir.types';

@CommandHandler(UpdateIRCommand)
export class UpdateIRHandler implements ICommandHandler<UpdateIRCommand> {
  constructor(private readonly irService: IRService) {}

  async execute(command: UpdateIRCommand): Promise<ApiResponse<IRDto>> {
    return this.irService.IR을_수정_한다(command.irId, {
      categoryId: command.categoryId,
      title: command.title,
      content: command.content,
      isPublic: command.isPublic,
    } as any);
  }
}
