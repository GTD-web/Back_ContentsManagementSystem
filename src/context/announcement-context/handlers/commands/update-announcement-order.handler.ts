import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AnnouncementService } from '@domain/core/announcement/announcement.service';
import { UpdateAnnouncementOrderDto } from '../../interfaces/announcement-context.interface';
import { Announcement } from '@domain/core/announcement/announcement.entity';
import { Logger } from '@nestjs/common';

/**
 * 공지사항 오더 수정 커맨드
 */
export class UpdateAnnouncementOrderCommand {
  constructor(
    public readonly id: string,
    public readonly data: UpdateAnnouncementOrderDto,
  ) {}
}

/**
 * 공지사항 오더 수정 핸들러
 */
@CommandHandler(UpdateAnnouncementOrderCommand)
export class UpdateAnnouncementOrderHandler
  implements ICommandHandler<UpdateAnnouncementOrderCommand>
{
  private readonly logger = new Logger(UpdateAnnouncementOrderHandler.name);

  constructor(private readonly announcementService: AnnouncementService) {}

  async execute(
    command: UpdateAnnouncementOrderCommand,
  ): Promise<Announcement> {
    const { id, data } = command;

    this.logger.log(
      `공지사항 오더 수정 시작 - ID: ${id}, Order: ${data.order}`,
    );

    // 정렬 순서 변경 전용 메서드 사용 (공개 상태에서도 가능)
    const updated = await this.announcementService.정렬_순서를_변경한다(
      id,
      data.order,
      data.updatedBy,
    );

    this.logger.log(`공지사항 오더 수정 완료 - ID: ${id}`);

    return updated;
  }
}
