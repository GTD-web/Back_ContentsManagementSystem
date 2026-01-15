import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SurveyService } from '@domain/sub/survey/survey.service';
import {
  CreateSurveyDto,
  CreateSurveyResult,
} from '../../interfaces/survey-context.interface';
import { Logger } from '@nestjs/common';

/**
 * 설문조사 생성 커맨드
 */
export class CreateSurveyCommand {
  constructor(public readonly data: CreateSurveyDto) {}
}

/**
 * 설문조사 생성 핸들러
 */
@CommandHandler(CreateSurveyCommand)
export class CreateSurveyHandler
  implements ICommandHandler<CreateSurveyCommand>
{
  private readonly logger = new Logger(CreateSurveyHandler.name);

  constructor(private readonly surveyService: SurveyService) {}

  async execute(command: CreateSurveyCommand): Promise<CreateSurveyResult> {
    const { data } = command;

    this.logger.log(
      `설문조사 생성 시작 - 공지사항 ID: ${data.announcementId}, 제목: ${data.title}`,
    );

    const saved = await this.surveyService.설문조사를_생성한다({
      announcementId: data.announcementId,
      title: data.title,
      description: data.description,
      startDate: data.startDate ?? undefined,
      endDate: data.endDate ?? undefined,
      order: data.order || 0,
      questions: data.questions,
    });

    this.logger.log(`설문조사 생성 완료 - ID: ${saved.id}`);

    return {
      id: saved.id,
      announcementId: saved.announcementId,
      title: saved.title,
      createdAt: saved.createdAt,
    };
  }
}
