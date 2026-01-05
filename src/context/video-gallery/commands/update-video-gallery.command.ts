export class UpdateVideoGalleryCommand {
  constructor(
    public readonly videoId: string,
    public readonly title?: string,
    public readonly categoryId?: string,
    public readonly isPublic?: boolean,
  ) {}
}
