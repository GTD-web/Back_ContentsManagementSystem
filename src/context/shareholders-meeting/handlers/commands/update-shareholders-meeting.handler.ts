import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateShareholdersMeetingCommand } from '../../commands/update-shareholders-meeting.command';
import { ShareholdersMeetingService } from '@business/shareholders-meeting/shareholders-meeting.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { ShareholdersMeetingDto } from '@domain/core/shareholders-meeting/shareholders-meeting.types';

@CommandHandler(UpdateShareholdersMeetingCommand)
export class UpdateShareholdersMeetingHandler
  implements ICommandHandler<UpdateShareholdersMeetingCommand>
{
  constructor(
    private readonly meetingService: ShareholdersMeetingService,
  ) {}

  async execute(
    command: UpdateShareholdersMeetingCommand,
  ): Promise<ApiResponse<ShareholdersMeetingDto>> {
    return this.meetingService.주주총회를_수정_한다(command.meetingId, {
      title: command.title,
      summary: command.summary,
      resultText: command.resultText,
      location: command.location,
      meetingDate: command.meetingDate,
      categoryId: command.categoryId,
      isPublic: command.isPublic,
      attachments: command.attachments,
    } as any);
  }
}
