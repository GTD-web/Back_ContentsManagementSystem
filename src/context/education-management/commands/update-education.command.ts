export class UpdateEducationCommand {
  constructor(
    public readonly educationId: string,
    public readonly title?: string,
    public readonly content?: string,
    public readonly deadline?: Date,
    public readonly isPublic?: boolean,
  ) {}
}
