export class UpdateShareholdersMeetingCommand {
  constructor(
    public readonly meetingId: string,
    public readonly title?: string,
    public readonly summary?: string,
    public readonly resultText?: string,
    public readonly location?: string,
    public readonly meetingDate?: Date,
    public readonly categoryId?: string,
    public readonly isPublic?: boolean,
    public readonly attachments?: string[],
  ) {}
}
