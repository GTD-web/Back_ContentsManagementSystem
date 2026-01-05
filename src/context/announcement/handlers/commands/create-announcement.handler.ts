import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAnnouncementCommand } from '../../commands/create-announcement.command';
import { AnnouncementService } from '@business/announcement/announcement.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { AnnouncementDto } from '@domain/core/announcement/announcement.types';

@CommandHandler(CreateAnnouncementCommand)
export class CreateAnnouncementHandler
  implements ICommandHandler<CreateAnnouncementCommand>
{
  constructor(private readonly announcementService: AnnouncementService) {}

  async execute(
    command: CreateAnnouncementCommand,
  ): Promise<ApiResponse<AnnouncementDto>> {
    return this.announcementService.공지사항을_생성_한다({
      title: command.title,
      content: command.content,
      categoryId: command.categoryId,
      isFixed: command.isFixed,
      mustRead: command.mustRead,
      releasedAt: command.releasedAt,
      expiredAt: command.expiredAt,
      attachments: command.attachments,
      employeeIds: command.employeeIds,
    } as any);
  }
}
