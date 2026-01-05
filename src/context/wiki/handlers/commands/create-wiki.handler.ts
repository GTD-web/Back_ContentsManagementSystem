import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateWikiCommand } from '../../commands/create-wiki.command';
import { WikiService } from '@business/wiki/wiki.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { WikiDto } from '@domain/sub/wiki/wiki.types';

@CommandHandler(CreateWikiCommand)
export class CreateWikiHandler implements ICommandHandler<CreateWikiCommand> {
  constructor(private readonly wikiService: WikiService) {}

  async execute(command: CreateWikiCommand): Promise<ApiResponse<WikiDto>> {
    return this.wikiService.위키를_생성_한다({
      title: command.title,
      content: command.content,
      fileSystemId: command.fileSystemId,
      isPublic: command.isPublic,
    } as any);
  }
}
