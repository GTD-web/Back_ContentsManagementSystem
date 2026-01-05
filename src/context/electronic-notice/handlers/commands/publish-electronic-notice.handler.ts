import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PublishElectronicNoticeCommand } from '../../commands/publish-electronic-notice.command';
import { ElectronicNoticeService } from '@business/electronic-notice/electronic-notice.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { ElectronicDisclosureDto } from '@domain/core/electronic-disclosure/electronic-disclosure.types';

@CommandHandler(PublishElectronicNoticeCommand)
export class PublishElectronicNoticeHandler
  implements ICommandHandler<PublishElectronicNoticeCommand>
{
  constructor(
    private readonly noticeService: ElectronicNoticeService,
  ) {}

  async execute(
    command: PublishElectronicNoticeCommand,
  ): Promise<ApiResponse<ElectronicDisclosureDto>> {
    return this.noticeService.전자공시를_공개_한다(command.noticeId);
  }
}
