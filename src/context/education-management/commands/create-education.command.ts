export class CreateEducationCommand {
  constructor(
    public readonly title: string,
    public readonly content: string,
    public readonly deadline: Date,
    public readonly isPublic?: boolean,
  ) {}
}
