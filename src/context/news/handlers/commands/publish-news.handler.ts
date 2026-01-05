import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PublishNewsCommand } from '../../commands/publish-news.command';
import { NewsService } from '@business/news/news.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { NewsDto } from '@domain/core/news/news.types';

/**
 * 뉴스 공개 커맨드 핸들러
 */
@CommandHandler(PublishNewsCommand)
export class PublishNewsHandler
  implements ICommandHandler<PublishNewsCommand>
{
  constructor(private readonly newsService: NewsService) {}

  async execute(command: PublishNewsCommand): Promise<ApiResponse<NewsDto>> {
    return this.newsService.뉴스를_공개_한다(command.newsId);
  }
}
