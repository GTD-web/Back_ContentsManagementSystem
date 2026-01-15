import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SurveyService } from '@domain/sub/survey/survey.service';
import { Survey } from '@domain/sub/survey/survey.entity';
import { Logger } from '@nestjs/common';

/**
 * 공지사항의 설문조사 조회 쿼리
 */
export class GetSurveyByAnnouncementQuery {
  constructor(public readonly announcementId: string) {}
}

/**
 * 공지사항의 설문조사 조회 핸들러
 */
@QueryHandler(GetSurveyByAnnouncementQuery)
export class GetSurveyByAnnouncementHandler
  implements IQueryHandler<GetSurveyByAnnouncementQuery>
{
  private readonly logger = new Logger(GetSurveyByAnnouncementHandler.name);

  constructor(private readonly surveyService: SurveyService) {}

  async execute(query: GetSurveyByAnnouncementQuery): Promise<Survey | null> {
    const { announcementId } = query;

    this.logger.log(
      `공지사항의 설문조사 조회 시작 - 공지사항 ID: ${announcementId}`,
    );

    const survey =
      await this.surveyService.공지사항ID로_설문조사를_조회한다(announcementId);

    this.logger.log(
      `공지사항의 설문조사 조회 완료 - 공지사항 ID: ${announcementId}`,
    );

    return survey;
  }
}
