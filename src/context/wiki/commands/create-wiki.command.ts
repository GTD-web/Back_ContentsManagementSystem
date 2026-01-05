export class CreateWikiCommand {
  constructor(
    public readonly title: string,
    public readonly content: string,
    public readonly fileSystemId: string,
    public readonly isPublic?: boolean,
  ) {}
}
