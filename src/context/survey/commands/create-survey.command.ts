export class CreateSurveyCommand {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly categoryId?: string,
    public readonly inqueries?: any[],
  ) {}
}
