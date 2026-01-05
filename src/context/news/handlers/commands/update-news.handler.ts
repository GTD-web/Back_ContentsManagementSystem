import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateNewsCommand } from '../../commands/update-news.command';
import { NewsService } from '@business/news/news.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { NewsDto } from '@domain/core/news/news.types';

/**
 * 뉴스 수정 커맨드 핸들러
 */
@CommandHandler(UpdateNewsCommand)
export class UpdateNewsHandler implements ICommandHandler<UpdateNewsCommand> {
  constructor(private readonly newsService: NewsService) {}

  async execute(command: UpdateNewsCommand): Promise<ApiResponse<NewsDto>> {
    return this.newsService.뉴스를_수정_한다(command.newsId, {
      categoryId: command.categoryId,
      title: command.title,
      content: command.content,
      isPublic: command.isPublic,
    } as any);
  }
}
