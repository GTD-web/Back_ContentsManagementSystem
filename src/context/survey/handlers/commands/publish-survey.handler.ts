import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PublishSurveyCommand } from '../../commands/publish-survey.command';
import { SurveyService } from '@business/survey/survey.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { SurveyDto } from '@domain/sub/survey/survey.types';

@CommandHandler(PublishSurveyCommand)
export class PublishSurveyHandler
  implements ICommandHandler<PublishSurveyCommand>
{
  constructor(private readonly surveyService: SurveyService) {}

  async execute(command: PublishSurveyCommand): Promise<ApiResponse<SurveyDto>> {
    return this.surveyService.설문조사를_공개한다(command.surveyId);
  }
}
