import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SurveyService } from '@domain/sub/survey/survey.service';
import { CompleteSurveyDto } from '../../interfaces/survey-context.interface';
import { SurveyCompletion } from '@domain/sub/survey/survey-completion.entity';
import { Logger } from '@nestjs/common';

/**
 * 설문 완료 커맨드
 */
export class CompleteSurveyCommand {
  constructor(public readonly data: CompleteSurveyDto) {}
}

/**
 * 설문 완료 핸들러
 */
@CommandHandler(CompleteSurveyCommand)
export class CompleteSurveyHandler
  implements ICommandHandler<CompleteSurveyCommand>
{
  private readonly logger = new Logger(CompleteSurveyHandler.name);

  constructor(private readonly surveyService: SurveyService) {}

  async execute(command: CompleteSurveyCommand): Promise<SurveyCompletion> {
    const { data } = command;

    this.logger.log(
      `설문 완료 기록 시작 - 설문 ID: ${data.surveyId}, 직원 ID: ${data.employeeId}`,
    );

    const completion = await this.surveyService.설문_완료를_기록한다(
      data.surveyId,
      data.employeeId,
    );

    this.logger.log(
      `설문 완료 기록 완료 - 설문 ID: ${data.surveyId}, 직원 ID: ${data.employeeId}`,
    );

    return completion;
  }
}
