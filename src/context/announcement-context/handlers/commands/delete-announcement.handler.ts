import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AnnouncementService } from '@domain/core/announcement/announcement.service';
import { Logger } from '@nestjs/common';

/**
 * 공지사항 삭제 커맨드
 */
export class DeleteAnnouncementCommand {
  constructor(public readonly id: string) {}
}

/**
 * 공지사항 삭제 핸들러
 */
@CommandHandler(DeleteAnnouncementCommand)
export class DeleteAnnouncementHandler
  implements ICommandHandler<DeleteAnnouncementCommand>
{
  private readonly logger = new Logger(DeleteAnnouncementHandler.name);

  constructor(private readonly announcementService: AnnouncementService) {}

  async execute(command: DeleteAnnouncementCommand): Promise<boolean> {
    const { id } = command;

    this.logger.log(`공지사항 삭제 시작 - ID: ${id}`);

    const result = await this.announcementService.공지사항을_삭제한다(id);

    this.logger.log(`공지사항 삭제 완료 - ID: ${id}`);

    return result;
  }
}
