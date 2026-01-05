import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendNotificationCommand } from '../../commands/send-notification.command';
import { NotificationService } from '@business/common/notification.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { NotificationResponseDto } from '@domain/common/notification/notification.types';

/**
 * 알림 전송 커맨드 핸들러
 */
@CommandHandler(SendNotificationCommand)
export class SendNotificationHandler
  implements ICommandHandler<SendNotificationCommand>
{
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  async execute(
    command: SendNotificationCommand,
  ): Promise<ApiResponse<NotificationResponseDto>> {
    return this.notificationService.알림을_전송_한다(command.entityId, {
      targetType: command.targetType,
      targetIds: command.targetIds,
      title: command.title,
      content: command.content,
    });
  }
}
