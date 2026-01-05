import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PublishAnnouncementPopupCommand } from '../../commands/publish-announcement-popup.command';
import { AnnouncementPopupService } from '@business/announcement-popup/announcement-popup.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { AnnouncementPopupDto } from '@domain/core/announcement-popup/announcement-popup.types';

@CommandHandler(PublishAnnouncementPopupCommand)
export class PublishAnnouncementPopupHandler
  implements ICommandHandler<PublishAnnouncementPopupCommand>
{
  constructor(
    private readonly popupService: AnnouncementPopupService,
  ) {}

  async execute(
    command: PublishAnnouncementPopupCommand,
  ): Promise<ApiResponse<AnnouncementPopupDto>> {
    return this.popupService.팝업을_공개_한다(command.popupId);
  }
}
