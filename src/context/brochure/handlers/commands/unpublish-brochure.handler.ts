import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnpublishBrochureCommand } from '../../commands/unpublish-brochure.command';
import { BrochureService } from '@business/brochure/brochure.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { BrochureDto } from '@domain/core/brochure/brochure.types';

@CommandHandler(UnpublishBrochureCommand)
export class UnpublishBrochureHandler
  implements ICommandHandler<UnpublishBrochureCommand>
{
  constructor(private readonly brochureService: BrochureService) {}

  async execute(
    command: UnpublishBrochureCommand,
  ): Promise<ApiResponse<BrochureDto>> {
    return this.brochureService.브로슈어를_비공개_한다(command.brochureId);
  }
}
