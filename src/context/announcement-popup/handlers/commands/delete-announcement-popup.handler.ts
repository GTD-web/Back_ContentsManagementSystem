import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteAnnouncementPopupCommand } from '../../commands/delete-announcement-popup.command';
import { AnnouncementPopupService } from '@business/announcement-popup/announcement-popup.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';

@CommandHandler(DeleteAnnouncementPopupCommand)
export class DeleteAnnouncementPopupHandler
  implements ICommandHandler<DeleteAnnouncementPopupCommand>
{
  constructor(
    private readonly popupService: AnnouncementPopupService,
  ) {}

  async execute(
    command: DeleteAnnouncementPopupCommand,
  ): Promise<ApiResponse<void>> {
    return this.popupService.팝업을_삭제_한다(command.popupId);
  }
}
