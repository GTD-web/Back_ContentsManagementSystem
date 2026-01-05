/**
 * 공지사항 수정 커맨드
 */
export class UpdateAnnouncementCommand {
  constructor(
    public readonly announcementId: string,
    public readonly title?: string,
    public readonly content?: string,
    public readonly categoryId?: string,
    public readonly isFixed?: boolean,
    public readonly mustRead?: boolean,
    public readonly releasedAt?: Date,
    public readonly expiredAt?: Date,
    public readonly attachments?: string[],
  ) {}
}
