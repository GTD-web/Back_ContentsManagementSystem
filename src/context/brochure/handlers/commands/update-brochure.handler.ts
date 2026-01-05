import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateBrochureCommand } from '../../commands/update-brochure.command';
import { BrochureService } from '@business/brochure/brochure.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { BrochureDto } from '@domain/core/brochure/brochure.types';

@CommandHandler(UpdateBrochureCommand)
export class UpdateBrochureHandler
  implements ICommandHandler<UpdateBrochureCommand>
{
  constructor(private readonly brochureService: BrochureService) {}

  async execute(
    command: UpdateBrochureCommand,
  ): Promise<ApiResponse<BrochureDto>> {
    return this.brochureService.브로슈어를_수정_한다(command.brochureId, {
      categoryId: command.categoryId,
      title: command.title,
      content: command.content,
      isPublic: command.isPublic,
    } as any);
  }
}
