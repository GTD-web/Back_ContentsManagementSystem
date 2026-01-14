import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from '@domain/core/announcement/announcement.entity';
import { AnnouncementListResult } from '../../interfaces/announcement-context.interface';
import { Logger } from '@nestjs/common';
import { ContentStatus } from '@domain/core/content-status.types';

/**
 * 공지사항 목록 조회 쿼리
 */
export class GetAnnouncementListQuery {
  constructor(
    public readonly isPublic?: boolean,
    public readonly isFixed?: boolean,
    public readonly status?: ContentStatus,
    public readonly orderBy: 'order' | 'createdAt' = 'order',
    public readonly page: number = 1,
    public readonly limit: number = 10,
  ) {}
}

/**
 * 공지사항 목록 조회 핸들러
 */
@QueryHandler(GetAnnouncementListQuery)
export class GetAnnouncementListHandler
  implements IQueryHandler<GetAnnouncementListQuery>
{
  private readonly logger = new Logger(GetAnnouncementListHandler.name);

  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,
  ) {}

  async execute(
    query: GetAnnouncementListQuery,
  ): Promise<AnnouncementListResult> {
    const { isPublic, isFixed, status, orderBy, page, limit } = query;

    this.logger.debug(
      `공지사항 목록 조회 - 공개: ${isPublic}, 고정: ${isFixed}, 상태: ${status}, 정렬: ${orderBy}, 페이지: ${page}, 제한: ${limit}`,
    );

    const queryBuilder =
      this.announcementRepository.createQueryBuilder('announcement');

    if (isPublic !== undefined) {
      queryBuilder.where('announcement.isPublic = :isPublic', { isPublic });
    }

    if (isFixed !== undefined) {
      if (isPublic !== undefined) {
        queryBuilder.andWhere('announcement.isFixed = :isFixed', { isFixed });
      } else {
        queryBuilder.where('announcement.isFixed = :isFixed', { isFixed });
      }
    }

    if (status) {
      if (isPublic !== undefined || isFixed !== undefined) {
        queryBuilder.andWhere('announcement.status = :status', { status });
      } else {
        queryBuilder.where('announcement.status = :status', { status });
      }
    }

    // 고정 공지는 항상 최상단
    queryBuilder.orderBy('announcement.isFixed', 'DESC');

    if (orderBy === 'order') {
      queryBuilder.addOrderBy('announcement.order', 'DESC');
    } else {
      queryBuilder.addOrderBy('announcement.createdAt', 'DESC');
    }

    // 페이지네이션 적용
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return { items, total, page, limit };
  }
}
