import { NotificationTargetType } from '@domain/common/notification/notification.types';

/**
 * 알림 전송 커맨드
 */
export class SendNotificationCommand {
  constructor(
    public readonly entityId: string,
    public readonly targetType: NotificationTargetType,
    public readonly targetIds: string[],
    public readonly title: string,
    public readonly content: string,
    public readonly notificationTypes: Array<'push' | 'email' | 'notification_center'>,
  ) {}
}
