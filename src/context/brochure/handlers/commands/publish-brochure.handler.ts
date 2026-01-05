import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PublishBrochureCommand } from '../../commands/publish-brochure.command';
import { BrochureService } from '@business/brochure/brochure.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { BrochureDto } from '@domain/core/brochure/brochure.types';

@CommandHandler(PublishBrochureCommand)
export class PublishBrochureHandler
  implements ICommandHandler<PublishBrochureCommand>
{
  constructor(private readonly brochureService: BrochureService) {}

  async execute(
    command: PublishBrochureCommand,
  ): Promise<ApiResponse<BrochureDto>> {
    return this.brochureService.브로슈어를_공개_한다(command.brochureId);
  }
}
