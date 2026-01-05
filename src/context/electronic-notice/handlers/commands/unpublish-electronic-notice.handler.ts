import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnpublishElectronicNoticeCommand } from '../../commands/unpublish-electronic-notice.command';
import { ElectronicNoticeService } from '@business/electronic-notice/electronic-notice.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { ElectronicDisclosureDto } from '@domain/core/electronic-disclosure/electronic-disclosure.types';

@CommandHandler(UnpublishElectronicNoticeCommand)
export class UnpublishElectronicNoticeHandler
  implements ICommandHandler<UnpublishElectronicNoticeCommand>
{
  constructor(
    private readonly noticeService: ElectronicNoticeService,
  ) {}

  async execute(
    command: UnpublishElectronicNoticeCommand,
  ): Promise<ApiResponse<ElectronicDisclosureDto>> {
    return this.noticeService.전자공시를_비공개_한다(command.noticeId);
  }
}
