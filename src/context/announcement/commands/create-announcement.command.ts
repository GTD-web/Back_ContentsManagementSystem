/**
 * 공지사항 생성 커맨드
 */
export class CreateAnnouncementCommand {
  constructor(
    public readonly title: string,
    public readonly content: string,
    public readonly categoryId?: string,
    public readonly isFixed?: boolean,
    public readonly mustRead?: boolean,
    public readonly releasedAt?: Date,
    public readonly expiredAt?: Date,
    public readonly attachments?: string[],
    public readonly employeeIds?: string[],
  ) {}
}
