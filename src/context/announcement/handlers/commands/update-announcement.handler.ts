import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAnnouncementCommand } from '../../commands/update-announcement.command';
import { AnnouncementService } from '@business/announcement/announcement.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { AnnouncementDto } from '@domain/core/announcement/announcement.types';

@CommandHandler(UpdateAnnouncementCommand)
export class UpdateAnnouncementHandler
  implements ICommandHandler<UpdateAnnouncementCommand>
{
  constructor(private readonly announcementService: AnnouncementService) {}

  async execute(
    command: UpdateAnnouncementCommand,
  ): Promise<ApiResponse<AnnouncementDto>> {
    return this.announcementService.공지사항을_수정_한다(
      command.announcementId,
      {
        title: command.title,
        content: command.content,
        categoryId: command.categoryId,
        isFixed: command.isFixed,
        mustRead: command.mustRead,
        releasedAt: command.releasedAt,
        expiredAt: command.expiredAt,
        attachments: command.attachments,
      } as any,
    );
  }
}
