import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AnnouncementService } from '@domain/core/announcement/announcement.service';
import { UpdateAnnouncementFixedDto } from '../../interfaces/announcement-context.interface';
import { Announcement } from '@domain/core/announcement/announcement.entity';
import { Logger } from '@nestjs/common';

/**
 * 공지사항 고정 상태 수정 커맨드
 */
export class UpdateAnnouncementFixedCommand {
  constructor(
    public readonly id: string,
    public readonly data: UpdateAnnouncementFixedDto,
  ) {}
}

/**
 * 공지사항 고정 상태 수정 핸들러
 */
@CommandHandler(UpdateAnnouncementFixedCommand)
export class UpdateAnnouncementFixedHandler
  implements ICommandHandler<UpdateAnnouncementFixedCommand>
{
  private readonly logger = new Logger(UpdateAnnouncementFixedHandler.name);

  constructor(private readonly announcementService: AnnouncementService) {}

  async execute(
    command: UpdateAnnouncementFixedCommand,
  ): Promise<Announcement> {
    const { id, data } = command;

    this.logger.log(
      `공지사항 고정 상태 수정 시작 - ID: ${id}, 고정: ${data.isFixed}`,
    );

    const updated = await this.announcementService.공지사항을_업데이트한다(id, {
      isFixed: data.isFixed,
      updatedBy: data.updatedBy,
    });

    this.logger.log(`공지사항 고정 상태 수정 완료 - ID: ${id}`);

    return updated;
  }
}
