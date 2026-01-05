import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteAnnouncementCommand } from '../../commands/delete-announcement.command';
import { AnnouncementService } from '@business/announcement/announcement.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';

@CommandHandler(DeleteAnnouncementCommand)
export class DeleteAnnouncementHandler
  implements ICommandHandler<DeleteAnnouncementCommand>
{
  constructor(private readonly announcementService: AnnouncementService) {}

  async execute(command: DeleteAnnouncementCommand): Promise<ApiResponse<void>> {
    return this.announcementService.공지사항을_삭제_한다(
      command.announcementId,
    );
  }
}
