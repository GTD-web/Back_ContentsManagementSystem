import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateSurveyCommand } from '../../commands/create-survey.command';
import { SurveyService } from '@business/survey/survey.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { SurveyDto } from '@domain/sub/survey/survey.types';

@CommandHandler(CreateSurveyCommand)
export class CreateSurveyHandler
  implements ICommandHandler<CreateSurveyCommand>
{
  constructor(private readonly surveyService: SurveyService) {}

  async execute(command: CreateSurveyCommand): Promise<ApiResponse<SurveyDto>> {
    return this.surveyService.설문조사를_생성_한다({
      title: command.title,
      description: command.description,
      categoryId: command.categoryId,
      inqueries: command.inqueries,
    } as any);
  }
}
