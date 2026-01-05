export class CreateShareholdersMeetingCommand {
  constructor(
    public readonly code: string,
    public readonly title: string,
    public readonly summary: string,
    public readonly resultText: string,
    public readonly location: string,
    public readonly meetingDate: Date,
    public readonly categoryId?: string,
    public readonly isPublic?: boolean,
    public readonly attachments?: string[],
  ) {}
}
