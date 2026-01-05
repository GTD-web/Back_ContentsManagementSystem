import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteLumirStoryCommand } from '../../commands/delete-lumir-story.command';
import { LumirStoryService } from '@business/lumir-story/lumir-story.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';

@CommandHandler(DeleteLumirStoryCommand)
export class DeleteLumirStoryHandler
  implements ICommandHandler<DeleteLumirStoryCommand>
{
  constructor(private readonly storyService: LumirStoryService) {}

  async execute(command: DeleteLumirStoryCommand): Promise<ApiResponse<void>> {
    return this.storyService.루미르_스토리를_삭제_한다(command.storyId);
  }
}
