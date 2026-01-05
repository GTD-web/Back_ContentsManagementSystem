import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteIRCommand } from '../../commands/delete-ir.command';
import { IRService } from '@business/ir/ir.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';

@CommandHandler(DeleteIRCommand)
export class DeleteIRHandler implements ICommandHandler<DeleteIRCommand> {
  constructor(private readonly irService: IRService) {}

  async execute(command: DeleteIRCommand): Promise<ApiResponse<void>> {
    return this.irService.IR을_삭제_한다(command.irId);
  }
}
