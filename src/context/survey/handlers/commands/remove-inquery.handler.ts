import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveInqueryCommand } from '../../commands/remove-inquery.command';
import { SurveyService } from '@business/survey/survey.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { SurveyDto } from '@domain/sub/survey/survey.types';

@CommandHandler(RemoveInqueryCommand)
export class RemoveInqueryHandler
  implements ICommandHandler<RemoveInqueryCommand>
{
  constructor(private readonly surveyService: SurveyService) {}

  async execute(command: RemoveInqueryCommand): Promise<ApiResponse<SurveyDto>> {
    return this.surveyService.질문을_삭제_한다(
      command.surveyId,
      command.inqueryId,
    );
  }
}
