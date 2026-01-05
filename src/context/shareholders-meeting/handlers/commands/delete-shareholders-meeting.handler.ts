import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteShareholdersMeetingCommand } from '../../commands/delete-shareholders-meeting.command';
import { ShareholdersMeetingService } from '@business/shareholders-meeting/shareholders-meeting.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';

@CommandHandler(DeleteShareholdersMeetingCommand)
export class DeleteShareholdersMeetingHandler
  implements ICommandHandler<DeleteShareholdersMeetingCommand>
{
  constructor(
    private readonly meetingService: ShareholdersMeetingService,
  ) {}

  async execute(
    command: DeleteShareholdersMeetingCommand,
  ): Promise<ApiResponse<void>> {
    return this.meetingService.주주총회를_삭제_한다(command.meetingId);
  }
}
