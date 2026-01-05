import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateIRCommand } from '../../commands/create-ir.command';
import { IRService } from '@business/ir/ir.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { IRDto } from '@domain/core/ir/ir.types';

@CommandHandler(CreateIRCommand)
export class CreateIRHandler implements ICommandHandler<CreateIRCommand> {
  constructor(private readonly irService: IRService) {}

  async execute(command: CreateIRCommand): Promise<ApiResponse<IRDto>> {
    return this.irService.IR을_생성_한다({
      code: command.code,
      categoryId: command.categoryId,
      title: command.title,
      content: command.content,
      isPublic: command.isPublic,
    } as any);
  }
}
