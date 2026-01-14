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

    const updated = await this.announcementService.공지사항을_업데이트한다(id, {
      order: data.order,
      updatedBy: data.updatedBy,
    });

    this.logger.log(`공지사항 오더 수정 완료 - ID: ${id}`);

    return updated;
  }
}
