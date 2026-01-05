import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteElectronicNoticeCommand } from '../../commands/delete-electronic-notice.command';
import { ElectronicNoticeService } from '@business/electronic-notice/electronic-notice.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';

@CommandHandler(DeleteElectronicNoticeCommand)
export class DeleteElectronicNoticeHandler
  implements ICommandHandler<DeleteElectronicNoticeCommand>
{
  constructor(
    private readonly noticeService: ElectronicNoticeService,
  ) {}

  async execute(
    command: DeleteElectronicNoticeCommand,
  ): Promise<ApiResponse<void>> {
    return this.noticeService.전자공시를_삭제_한다(command.noticeId);
  }
}
