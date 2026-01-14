import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AnnouncementService } from '@domain/core/announcement/announcement.service';
import { UpdateAnnouncementDto } from '../../interfaces/announcement-context.interface';
import { Announcement } from '@domain/core/announcement/announcement.entity';
import { Logger } from '@nestjs/common';

/**
 * 공지사항 수정 커맨드
 */
export class UpdateAnnouncementCommand {
  constructor(
    public readonly id: string,
    public readonly data: UpdateAnnouncementDto,
  ) {}
}

/**
 * 공지사항 수정 핸들러
 */
@CommandHandler(UpdateAnnouncementCommand)
export class UpdateAnnouncementHandler
  implements ICommandHandler<UpdateAnnouncementCommand>
{
  private readonly logger = new Logger(UpdateAnnouncementHandler.name);

  constructor(private readonly announcementService: AnnouncementService) {}

  async execute(command: UpdateAnnouncementCommand): Promise<Announcement> {
    const { id, data } = command;

    this.logger.log(`공지사항 수정 시작 - ID: ${id}`);

    const updated = await this.announcementService.공지사항을_업데이트한다(
      id,
      data,
    );

    this.logger.log(`공지사항 수정 완료 - ID: ${id}`);

    return updated;
  }
}
