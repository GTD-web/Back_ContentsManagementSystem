import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateSurveyCommand } from '../../commands/update-survey.command';
import { SurveyService } from '@business/survey/survey.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { SurveyDto } from '@domain/sub/survey/survey.types';

@CommandHandler(UpdateSurveyCommand)
export class UpdateSurveyHandler
  implements ICommandHandler<UpdateSurveyCommand>
{
  constructor(private readonly surveyService: SurveyService) {}

  async execute(command: UpdateSurveyCommand): Promise<ApiResponse<SurveyDto>> {
    return this.surveyService.설문조사를_수정_한다(command.surveyId, {
      title: command.title,
      description: command.description,
      categoryId: command.categoryId,
    } as any);
  }
}
