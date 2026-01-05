export class UpdateIRCommand {
  constructor(
    public readonly irId: string,
    public readonly categoryId?: string,
    public readonly title?: string,
    public readonly content?: string,
    public readonly isPublic?: boolean,
  ) {}
}
