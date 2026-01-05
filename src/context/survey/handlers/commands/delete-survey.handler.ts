import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteSurveyCommand } from '../../commands/delete-survey.command';
import { SurveyService } from '@business/survey/survey.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';

@CommandHandler(DeleteSurveyCommand)
export class DeleteSurveyHandler
  implements ICommandHandler<DeleteSurveyCommand>
{
  constructor(private readonly surveyService: SurveyService) {}

  async execute(command: DeleteSurveyCommand): Promise<ApiResponse<void>> {
    return this.surveyService.설문조사를_삭제_한다(command.surveyId);
  }
}
