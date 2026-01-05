export class UpdateWikiCommand {
  constructor(
    public readonly wikiId: string,
    public readonly title?: string,
    public readonly content?: string,
    public readonly isPublic?: boolean,
  ) {}
}
