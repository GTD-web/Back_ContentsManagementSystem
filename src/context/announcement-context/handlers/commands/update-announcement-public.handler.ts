import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AnnouncementService } from '@domain/core/announcement/announcement.service';
import { UpdateAnnouncementPublicDto } from '../../interfaces/announcement-context.interface';
import { Announcement } from '@domain/core/announcement/announcement.entity';
import { Logger } from '@nestjs/common';

/**
 * 공지사항 공개 상태 수정 커맨드
 */
export class UpdateAnnouncementPublicCommand {
  constructor(
    public readonly id: string,
    public readonly data: UpdateAnnouncementPublicDto,
  ) {}
}

/**
 * 공지사항 공개 상태 수정 핸들러
 */
@CommandHandler(UpdateAnnouncementPublicCommand)
export class UpdateAnnouncementPublicHandler
  implements ICommandHandler<UpdateAnnouncementPublicCommand>
{
  private readonly logger = new Logger(UpdateAnnouncementPublicHandler.name);

  constructor(private readonly announcementService: AnnouncementService) {}

  async execute(
    command: UpdateAnnouncementPublicCommand,
  ): Promise<Announcement> {
    const { id, data } = command;

    this.logger.log(
      `공지사항 공개 상태 수정 시작 - ID: ${id}, 공개: ${data.isPublic}`,
    );

    const updated = await this.announcementService.공지사항을_업데이트한다(id, {
      isPublic: data.isPublic,
      updatedBy: data.updatedBy,
    });

    this.logger.log(`공지사항 공개 상태 수정 완료 - ID: ${id}`);

    return updated;
  }
}
