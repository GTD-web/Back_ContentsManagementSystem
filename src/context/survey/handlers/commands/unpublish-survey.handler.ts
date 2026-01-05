import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnpublishSurveyCommand } from '../../commands/unpublish-survey.command';
import { SurveyService } from '@business/survey/survey.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { SurveyDto } from '@domain/sub/survey/survey.types';

@CommandHandler(UnpublishSurveyCommand)
export class UnpublishSurveyHandler
  implements ICommandHandler<UnpublishSurveyCommand>
{
  constructor(private readonly surveyService: SurveyService) {}

  async execute(
    command: UnpublishSurveyCommand,
  ): Promise<ApiResponse<SurveyDto>> {
    return this.surveyService.설문조사를_비공개한다(command.surveyId);
  }
}
