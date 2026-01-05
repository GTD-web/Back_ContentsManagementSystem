import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnpublishAnnouncementPopupCommand } from '../../commands/unpublish-announcement-popup.command';
import { AnnouncementPopupService } from '@business/announcement-popup/announcement-popup.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { AnnouncementPopupDto } from '@domain/core/announcement-popup/announcement-popup.types';

@CommandHandler(UnpublishAnnouncementPopupCommand)
export class UnpublishAnnouncementPopupHandler
  implements ICommandHandler<UnpublishAnnouncementPopupCommand>
{
  constructor(
    private readonly popupService: AnnouncementPopupService,
  ) {}

  async execute(
    command: UnpublishAnnouncementPopupCommand,
  ): Promise<ApiResponse<AnnouncementPopupDto>> {
    return this.popupService.팝업을_비공개_한다(command.popupId);
  }
}
