export class UpdateSurveyCommand {
  constructor(
    public readonly surveyId: string,
    public readonly title?: string,
    public readonly description?: string,
    public readonly categoryId?: string,
  ) {}
}
