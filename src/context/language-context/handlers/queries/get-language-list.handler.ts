import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from '@domain/common/language/language.entity';
import { LanguageListResult } from '../../interfaces/language-context.interface';
import { Logger } from '@nestjs/common';

/**
 * 언어 목록 조회 쿼리
 */
export class GetLanguageListQuery {
  constructor(public readonly includeInactive: boolean = false) {}
}

/**
 * 언어 목록 조회 핸들러
 */
@QueryHandler(GetLanguageListQuery)
export class GetLanguageListHandler implements IQueryHandler<GetLanguageListQuery> {
  private readonly logger = new Logger(GetLanguageListHandler.name);

  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}

  async execute(query: GetLanguageListQuery): Promise<LanguageListResult> {
    const { includeInactive } = query;

    this.logger.debug(`언어 목록 조회 - 비활성 포함: ${includeInactive}`);

    // 한 번이라도 추가된 언어는 항상 조회 가능 (soft delete 무시)
    const queryBuilder = this.languageRepository
      .createQueryBuilder('language');

    if (!includeInactive) {
      // 활성 언어만 조회 (isActive=true)
      queryBuilder.where('language.isActive = :isActive', { isActive: true });
    }

    const [items, total] = await queryBuilder
      .orderBy('language.order', 'ASC')
      .addOrderBy('language.createdAt', 'ASC')
      .getManyAndCount();

    return { items, total };
  }
}
