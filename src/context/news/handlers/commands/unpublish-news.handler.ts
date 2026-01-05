import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnpublishNewsCommand } from '../../commands/unpublish-news.command';
import { NewsService } from '@business/news/news.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { NewsDto } from '@domain/core/news/news.types';

/**
 * 뉴스 비공개 커맨드 핸들러
 */
@CommandHandler(UnpublishNewsCommand)
export class UnpublishNewsHandler
  implements ICommandHandler<UnpublishNewsCommand>
{
  constructor(private readonly newsService: NewsService) {}

  async execute(command: UnpublishNewsCommand): Promise<ApiResponse<NewsDto>> {
    return this.newsService.뉴스를_비공개_한다(command.newsId);
  }
}
