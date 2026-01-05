import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteNewsCommand } from '../../commands/delete-news.command';
import { NewsService } from '@business/news/news.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';

/**
 * 뉴스 삭제 커맨드 핸들러
 */
@CommandHandler(DeleteNewsCommand)
export class DeleteNewsHandler implements ICommandHandler<DeleteNewsCommand> {
  constructor(private readonly newsService: NewsService) {}

  async execute(command: DeleteNewsCommand): Promise<ApiResponse<void>> {
    return this.newsService.뉴스를_삭제_한다(command.newsId);
  }
}
