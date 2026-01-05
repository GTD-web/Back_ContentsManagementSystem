import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateEmployeeResponseCommand } from '../../commands/update-employee-response.command';
import { AnnouncementService } from '@business/announcement/announcement.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { AnnouncementDto } from '@domain/core/announcement/announcement.types';

@CommandHandler(UpdateEmployeeResponseCommand)
export class UpdateEmployeeResponseHandler
  implements ICommandHandler<UpdateEmployeeResponseCommand>
{
  constructor(private readonly announcementService: AnnouncementService) {}

  async execute(
    command: UpdateEmployeeResponseCommand,
  ): Promise<ApiResponse<AnnouncementDto>> {
    return this.announcementService.직원_응답을_업데이트_한다(
      command.announcementId,
      command.employeeId,
      {
        isRead: command.isRead,
        isSubmitted: command.isSubmitted,
        responseMessage: command.responseMessage,
      },
    );
  }
}
