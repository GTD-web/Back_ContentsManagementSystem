import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SurveyService } from '@domain/sub/survey/survey.service';
import { UpdateSurveyDto } from '../../interfaces/survey-context.interface';
import { Survey } from '@domain/sub/survey/survey.entity';
import { Logger } from '@nestjs/common';

/**
 * 설문조사 수정 커맨드
 */
export class UpdateSurveyCommand {
  constructor(
    public readonly id: string,
    public readonly data: UpdateSurveyDto,
  ) {}
}

/**
 * 설문조사 수정 핸들러
 */
@CommandHandler(UpdateSurveyCommand)
export class UpdateSurveyHandler
  implements ICommandHandler<UpdateSurveyCommand>
{
  private readonly logger = new Logger(UpdateSurveyHandler.name);

  constructor(private readonly surveyService: SurveyService) {}

  async execute(command: UpdateSurveyCommand): Promise<Survey> {
    const { id, data } = command;

    this.logger.log(`설문조사 수정 시작 - ID: ${id}`);

    // null을 undefined로 변환
    const updateData = {
      ...data,
      startDate: data.startDate === null ? undefined : data.startDate,
      endDate: data.endDate === null ? undefined : data.endDate,
    };

    const updated = await this.surveyService.설문조사를_업데이트한다(id, updateData);

    this.logger.log(`설문조사 수정 완료 - ID: ${id}`);

    return updated;
  }
}
