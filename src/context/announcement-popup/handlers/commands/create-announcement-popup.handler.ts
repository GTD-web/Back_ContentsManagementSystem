import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAnnouncementPopupCommand } from '../../commands/create-announcement-popup.command';
import { AnnouncementPopupService } from '@business/announcement-popup/announcement-popup.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { AnnouncementPopupDto } from '@domain/core/announcement-popup/announcement-popup.types';

@CommandHandler(CreateAnnouncementPopupCommand)
export class CreateAnnouncementPopupHandler
  implements ICommandHandler<CreateAnnouncementPopupCommand>
{
  constructor(
    private readonly popupService: AnnouncementPopupService,
  ) {}

  async execute(
    command: CreateAnnouncementPopupCommand,
  ): Promise<ApiResponse<AnnouncementPopupDto>> {
    return this.popupService.팝업을_생성_한다({
      title: command.title,
      categoryId: command.categoryId,
      isPublic: command.isPublic,
      attachments: command.attachments,
      releasedAt: command.releasedAt,
    } as any);
  }
}
