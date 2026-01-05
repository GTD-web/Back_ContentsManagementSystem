export class UpdateElectronicNoticeCommand {
  constructor(
    public readonly noticeId: string,
    public readonly categoryId?: string,
    public readonly title?: string,
    public readonly content?: string,
    public readonly isPublic?: boolean,
  ) {}
}
