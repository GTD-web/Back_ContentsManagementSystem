import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateLumirStoryCommand } from '../../commands/create-lumir-story.command';
import { LumirStoryService } from '@business/lumir-story/lumir-story.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { LumirStoryDto } from '@domain/sub/lumir-story/lumir-story.types';

@CommandHandler(CreateLumirStoryCommand)
export class CreateLumirStoryHandler
  implements ICommandHandler<CreateLumirStoryCommand>
{
  constructor(private readonly storyService: LumirStoryService) {}

  async execute(
    command: CreateLumirStoryCommand,
  ): Promise<ApiResponse<LumirStoryDto>> {
    return this.storyService.루미르_스토리를_생성_한다({
      code: command.code,
      title: command.title,
      categoryId: command.categoryId,
      isPublic: command.isPublic,
    } as any);
  }
}
