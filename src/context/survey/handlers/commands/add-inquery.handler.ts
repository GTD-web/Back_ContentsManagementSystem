import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddInqueryCommand } from '../../commands/add-inquery.command';
import { SurveyService } from '@business/survey/survey.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { SurveyDto } from '@domain/sub/survey/survey.types';

@CommandHandler(AddInqueryCommand)
export class AddInqueryHandler implements ICommandHandler<AddInqueryCommand> {
  constructor(private readonly surveyService: SurveyService) {}

  async execute(command: AddInqueryCommand): Promise<ApiResponse<SurveyDto>> {
    return this.surveyService.질문을_추가_한다(
      command.surveyId,
      command.inquery,
    );
  }
}
