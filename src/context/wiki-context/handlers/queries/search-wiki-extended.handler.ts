import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { WikiFileSystemService } from '@domain/sub/wiki-file-system/wiki-file-system.service';
import { WikiFileSystem } from '@domain/sub/wiki-file-system/wiki-file-system.entity';

export class SearchWikiExtendedQuery {
  constructor(public readonly query: string) {}
}

/**
 * Wiki 확장 검색 Query Handler (파일 + 폴더)
 */
@QueryHandler(SearchWikiExtendedQuery)
export class SearchWikiExtendedHandler implements IQueryHandler<SearchWikiExtendedQuery> {
  private readonly logger = new Logger(SearchWikiExtendedHandler.name);

  constructor(
    private readonly wikiFileSystemService: WikiFileSystemService,
  ) {}

  async execute(
    query: SearchWikiExtendedQuery,
  ): Promise<Array<{ wiki: WikiFileSystem; path: Array<{ wiki: WikiFileSystem; depth: number }> }>> {
    this.logger.log(`위키 확장 검색 쿼리 실행 - 검색어: ${query.query}`);

    const results = await this.wikiFileSystemService.위키를_확장_검색한다(query.query);

    this.logger.log(`위키 확장 검색 완료 - 결과: ${results.length}개`);

    return results;
  }
}
