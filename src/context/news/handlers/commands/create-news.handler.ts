import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateNewsCommand } from '../../commands/create-news.command';
import { NewsService } from '@business/news/news.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { NewsDto } from '@domain/core/news/news.types';

/**
 * 뉴스 생성 커맨드 핸들러
 */
@CommandHandler(CreateNewsCommand)
export class CreateNewsHandler implements ICommandHandler<CreateNewsCommand> {
  constructor(private readonly newsService: NewsService) {}

  async execute(command: CreateNewsCommand): Promise<ApiResponse<NewsDto>> {
    return this.newsService.뉴스를_생성_한다({
      code: command.code,
      categoryId: command.categoryId,
      title: command.title,
      content: command.content,
      isPublic: command.isPublic,
    } as any);
  }
}
