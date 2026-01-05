import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateWikiCommand } from '../../commands/update-wiki.command';
import { WikiService } from '@business/wiki/wiki.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { WikiDto } from '@domain/sub/wiki/wiki.types';

@CommandHandler(UpdateWikiCommand)
export class UpdateWikiHandler implements ICommandHandler<UpdateWikiCommand> {
  constructor(private readonly wikiService: WikiService) {}

  async execute(command: UpdateWikiCommand): Promise<ApiResponse<WikiDto>> {
    return this.wikiService.위키를_수정_한다(command.wikiId, {
      title: command.title,
      content: command.content,
      isPublic: command.isPublic,
    } as any);
  }
}
