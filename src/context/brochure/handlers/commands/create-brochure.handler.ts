import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBrochureCommand } from '../../commands/create-brochure.command';
import { BrochureService } from '@business/brochure/brochure.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { BrochureDto } from '@domain/core/brochure/brochure.types';

@CommandHandler(CreateBrochureCommand)
export class CreateBrochureHandler
  implements ICommandHandler<CreateBrochureCommand>
{
  constructor(private readonly brochureService: BrochureService) {}

  async execute(
    command: CreateBrochureCommand,
  ): Promise<ApiResponse<BrochureDto>> {
    return this.brochureService.브로슈어를_생성_한다({
      code: command.code,
      categoryId: command.categoryId,
      title: command.title,
      content: command.content,
      isPublic: command.isPublic,
    } as any);
  }
}
