import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnpublishLumirStoryCommand } from '../../commands/unpublish-lumir-story.command';
import { LumirStoryService } from '@business/lumir-story/lumir-story.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { LumirStoryDto } from '@domain/sub/lumir-story/lumir-story.types';

@CommandHandler(UnpublishLumirStoryCommand)
export class UnpublishLumirStoryHandler
  implements ICommandHandler<UnpublishLumirStoryCommand>
{
  constructor(private readonly storyService: LumirStoryService) {}

  async execute(
    command: UnpublishLumirStoryCommand,
  ): Promise<ApiResponse<LumirStoryDto>> {
    return this.storyService.루미르_스토리를_비공개_한다(command.storyId);
  }
}
