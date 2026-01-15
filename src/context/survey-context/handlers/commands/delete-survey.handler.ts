import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SurveyService } from '@domain/sub/survey/survey.service';
import { Logger } from '@nestjs/common';

/**
 * 설문조사 삭제 커맨드
 */
export class DeleteSurveyCommand {
  constructor(public readonly id: string) {}
}

/**
 * 설문조사 삭제 핸들러
 */
@CommandHandler(DeleteSurveyCommand)
export class DeleteSurveyHandler
  implements ICommandHandler<DeleteSurveyCommand>
{
  private readonly logger = new Logger(DeleteSurveyHandler.name);

  constructor(private readonly surveyService: SurveyService) {}

  async execute(command: DeleteSurveyCommand): Promise<boolean> {
    const { id } = command;

    this.logger.log(`설문조사 삭제 시작 - ID: ${id}`);

    const result = await this.surveyService.설문조사를_삭제한다(id);

    this.logger.log(`설문조사 삭제 완료 - ID: ${id}`);

    return result;
  }
}
