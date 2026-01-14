import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { AnnouncementService } from '@domain/core/announcement/announcement.service';
import { AnnouncementDetailResult } from '../../interfaces/announcement-context.interface';
import { Logger } from '@nestjs/common';

/**
 * 공지사항 상세 조회 쿼리
 */
export class GetAnnouncementDetailQuery {
  constructor(public readonly id: string) {}
}

/**
 * 공지사항 상세 조회 핸들러
 */
@QueryHandler(GetAnnouncementDetailQuery)
export class GetAnnouncementDetailHandler
  implements IQueryHandler<GetAnnouncementDetailQuery>
{
  private readonly logger = new Logger(GetAnnouncementDetailHandler.name);

  constructor(private readonly announcementService: AnnouncementService) {}

  async execute(
    query: GetAnnouncementDetailQuery,
  ): Promise<AnnouncementDetailResult> {
    const { id } = query;

    this.logger.debug(`공지사항 상세 조회 - ID: ${id}`);

    const announcement =
      await this.announcementService.ID로_공지사항을_조회한다(id);

    return announcement;
  }
}
