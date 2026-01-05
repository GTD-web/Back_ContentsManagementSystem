import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PublishLumirStoryCommand } from '../../commands/publish-lumir-story.command';
import { LumirStoryService } from '@business/lumir-story/lumir-story.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { LumirStoryDto } from '@domain/sub/lumir-story/lumir-story.types';

@CommandHandler(PublishLumirStoryCommand)
export class PublishLumirStoryHandler
  implements ICommandHandler<PublishLumirStoryCommand>
{
  constructor(private readonly storyService: LumirStoryService) {}

  async execute(
    command: PublishLumirStoryCommand,
  ): Promise<ApiResponse<LumirStoryDto>> {
    return this.storyService.루미르_스토리를_공개_한다(command.storyId);
  }
}
