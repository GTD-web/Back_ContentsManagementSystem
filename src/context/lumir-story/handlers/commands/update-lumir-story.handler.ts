import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateLumirStoryCommand } from '../../commands/update-lumir-story.command';
import { LumirStoryService } from '@business/lumir-story/lumir-story.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { LumirStoryDto } from '@domain/sub/lumir-story/lumir-story.types';

@CommandHandler(UpdateLumirStoryCommand)
export class UpdateLumirStoryHandler
  implements ICommandHandler<UpdateLumirStoryCommand>
{
  constructor(private readonly storyService: LumirStoryService) {}

  async execute(
    command: UpdateLumirStoryCommand,
  ): Promise<ApiResponse<LumirStoryDto>> {
    return this.storyService.루미르_스토리를_수정_한다(command.storyId, {
      title: command.title,
      categoryId: command.categoryId,
      isPublic: command.isPublic,
    } as any);
  }
}
