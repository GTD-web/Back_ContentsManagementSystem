export class UpdateLumirStoryCommand {
  constructor(
    public readonly storyId: string,
    public readonly title?: string,
    public readonly categoryId?: string,
    public readonly isPublic?: boolean,
  ) {}
}
