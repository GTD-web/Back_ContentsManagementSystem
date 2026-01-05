export class CreateElectronicNoticeCommand {
  constructor(
    public readonly code: string,
    public readonly categoryId?: string,
    public readonly title?: string,
    public readonly content?: string,
    public readonly isPublic?: boolean,
  ) {}
}
