import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateShareholdersMeetingCommand } from '../../commands/create-shareholders-meeting.command';
import { ShareholdersMeetingService } from '@business/shareholders-meeting/shareholders-meeting.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { ShareholdersMeetingDto } from '@domain/core/shareholders-meeting/shareholders-meeting.types';

@CommandHandler(CreateShareholdersMeetingCommand)
export class CreateShareholdersMeetingHandler
  implements ICommandHandler<CreateShareholdersMeetingCommand>
{
  constructor(
    private readonly meetingService: ShareholdersMeetingService,
  ) {}

  async execute(
    command: CreateShareholdersMeetingCommand,
  ): Promise<ApiResponse<ShareholdersMeetingDto>> {
    return this.meetingService.주주총회를_생성_한다({
      code: command.code,
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
