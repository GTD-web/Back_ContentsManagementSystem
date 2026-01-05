import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAnnouncementPopupCommand } from '../../commands/update-announcement-popup.command';
import { AnnouncementPopupService } from '@business/announcement-popup/announcement-popup.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { AnnouncementPopupDto } from '@domain/core/announcement-popup/announcement-popup.types';

@CommandHandler(UpdateAnnouncementPopupCommand)
export class UpdateAnnouncementPopupHandler
  implements ICommandHandler<UpdateAnnouncementPopupCommand>
{
  constructor(
    private readonly popupService: AnnouncementPopupService,
  ) {}

  async execute(
    command: UpdateAnnouncementPopupCommand,
  ): Promise<ApiResponse<AnnouncementPopupDto>> {
    return this.popupService.팝업을_수정_한다(command.popupId, {
      title: command.title,
      categoryId: command.categoryId,
      isPublic: command.isPublic,
      attachments: command.attachments,
      releasedAt: command.releasedAt,
    } as any);
  }
}
