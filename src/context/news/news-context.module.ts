import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { NewsBusinessModule } from '@business/news';

// Command Handlers
import { CreateNewsHandler } from './handlers/commands/create-news.handler';
import { UpdateNewsHandler } from './handlers/commands/update-news.handler';
import { DeleteNewsHandler } from './handlers/commands/delete-news.handler';
import { PublishNewsHandler } from './handlers/commands/publish-news.handler';
import { UnpublishNewsHandler } from './handlers/commands/unpublish-news.handler';

// Query Handlers
import { GetAllNewsHandler } from './handlers/queries/get-all-news.handler';
import { GetNewsHandler } from './handlers/queries/get-news.handler';

const CommandHandlers = [
  CreateNewsHandler,
  UpdateNewsHandler,
  DeleteNewsHandler,
  PublishNewsHandler,
  UnpublishNewsHandler,
];

const QueryHandlers = [GetAllNewsHandler, GetNewsHandler];

/**
 * 뉴스 Context Layer
 *
 * @description
 * - CQRS 패턴을 사용하여 Command와 Query를 분리합니다.
 * - 뉴스 관련 Command/Query를 처리합니다.
 */
@Module({
  imports: [CqrsModule, NewsBusinessModule],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [CqrsModule],
})
export class NewsContextModule {}
