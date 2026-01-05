import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteWikiCommand } from '../../commands/delete-wiki.command';
import { WikiService } from '@business/wiki/wiki.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';

@CommandHandler(DeleteWikiCommand)
export class DeleteWikiHandler implements ICommandHandler<DeleteWikiCommand> {
  constructor(private readonly wikiService: WikiService) {}

  async execute(command: DeleteWikiCommand): Promise<ApiResponse<void>> {
    return this.wikiService.위키를_삭제_한다(command.wikiId);
  }
}
