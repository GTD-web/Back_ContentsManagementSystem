export class AddInqueryCommand {
  constructor(
    public readonly surveyId: string,
    public readonly inquery: any,
  ) {}
}
