export class CreateAnnouncementPopupCommand {
  constructor(
    public readonly title: string,
    public readonly categoryId?: string,
    public readonly isPublic?: boolean,
    public readonly attachments?: string[],
    public readonly releasedAt?: Date,
  ) {}
}
