import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { WikiFileSystemService } from '@domain/sub/wiki-file-system/wiki-file-system.service';
import { WikiFileSystem } from '@domain/sub/wiki-file-system/wiki-file-system.entity';

export class SearchWikiQuery {
  constructor(public readonly query: string) {}
}

/**
 * Wiki 검색 Query Handler
 */
@QueryHandler(SearchWikiQuery)
export class SearchWikiHandler implements IQueryHandler<SearchWikiQuery> {
  private readonly logger = new Logger(SearchWikiHandler.name);

  constructor(
    private readonly wikiFileSystemService: WikiFileSystemService,
  ) {}

  async execute(
    query: SearchWikiQuery,
  ): Promise<Array<{ wiki: WikiFileSystem; path: Array<{ wiki: WikiFileSystem; depth: number }> }>> {
    this.logger.log(`위키 검색 쿼리 실행 - 검색어: ${query.query}`);

    const results = await this.wikiFileSystemService.위키를_검색한다(query.query);

    this.logger.log(`위키 검색 완료 - 결과: ${results.length}개`);

    return results;
  }
}
