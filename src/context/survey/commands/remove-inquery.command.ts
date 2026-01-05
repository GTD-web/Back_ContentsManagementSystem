export class RemoveInqueryCommand {
  constructor(
    public readonly surveyId: string,
    public readonly inqueryId: string,
  ) {}
}
