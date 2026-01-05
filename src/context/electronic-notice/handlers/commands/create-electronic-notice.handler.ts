import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateElectronicNoticeCommand } from '../../commands/create-electronic-notice.command';
import { ElectronicNoticeService } from '@business/electronic-notice/electronic-notice.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { ElectronicDisclosureDto } from '@domain/core/electronic-disclosure/electronic-disclosure.types';

@CommandHandler(CreateElectronicNoticeCommand)
export class CreateElectronicNoticeHandler
  implements ICommandHandler<CreateElectronicNoticeCommand>
{
  constructor(
    private readonly noticeService: ElectronicNoticeService,
  ) {}

  async execute(
    command: CreateElectronicNoticeCommand,
  ): Promise<ApiResponse<ElectronicDisclosureDto>> {
    return this.noticeService.전자공시를_생성_한다({
      code: command.code,
      categoryId: command.categoryId,
      title: command.title,
      content: command.content,
      isPublic: command.isPublic,
    } as any);
  }
}
