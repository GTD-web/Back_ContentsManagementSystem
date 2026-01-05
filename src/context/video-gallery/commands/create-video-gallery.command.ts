export class CreateVideoGalleryCommand {
  constructor(
    public readonly code: string,
    public readonly title: string,
    public readonly categoryId?: string,
    public readonly isPublic?: boolean,
  ) {}
}
