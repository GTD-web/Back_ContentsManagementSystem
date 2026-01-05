import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateElectronicNoticeCommand } from '../../commands/update-electronic-notice.command';
import { ElectronicNoticeService } from '@business/electronic-notice/electronic-notice.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { ElectronicDisclosureDto } from '@domain/core/electronic-disclosure/electronic-disclosure.types';

@CommandHandler(UpdateElectronicNoticeCommand)
export class UpdateElectronicNoticeHandler
  implements ICommandHandler<UpdateElectronicNoticeCommand>
{
  constructor(
    private readonly noticeService: ElectronicNoticeService,
  ) {}

  async execute(
    command: UpdateElectronicNoticeCommand,
  ): Promise<ApiResponse<ElectronicDisclosureDto>> {
    return this.noticeService.전자공시를_수정_한다(command.noticeId, {
      categoryId: command.categoryId,
      title: command.title,
      content: command.content,
      isPublic: command.isPublic,
    } as any);
  }
}
