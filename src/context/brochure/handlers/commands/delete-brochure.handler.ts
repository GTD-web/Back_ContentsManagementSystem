import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteBrochureCommand } from '../../commands/delete-brochure.command';
import { BrochureService } from '@business/brochure/brochure.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';

@CommandHandler(DeleteBrochureCommand)
export class DeleteBrochureHandler
  implements ICommandHandler<DeleteBrochureCommand>
{
  constructor(private readonly brochureService: BrochureService) {}

  async execute(command: DeleteBrochureCommand): Promise<ApiResponse<void>> {
    return this.brochureService.브로슈어를_삭제_한다(command.brochureId);
  }
}
