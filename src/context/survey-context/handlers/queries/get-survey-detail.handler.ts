import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SurveyService } from '@domain/sub/survey/survey.service';
import { SurveyDetailResult } from '../../interfaces/survey-context.interface';
import { Logger } from '@nestjs/common';

/**
 * 설문조사 상세 조회 쿼리
 */
export class GetSurveyDetailQuery {
  constructor(public readonly id: string) {}
}

/**
 * 설문조사 상세 조회 핸들러
 */
@QueryHandler(GetSurveyDetailQuery)
export class GetSurveyDetailHandler
  implements IQueryHandler<GetSurveyDetailQuery>
{
  private readonly logger = new Logger(GetSurveyDetailHandler.name);

  constructor(private readonly surveyService: SurveyService) {}

  async execute(query: GetSurveyDetailQuery): Promise<SurveyDetailResult> {
    const { id } = query;

    this.logger.log(`설문조사 상세 조회 시작 - ID: ${id}`);

    const survey = await this.surveyService.ID로_설문조사를_조회한다(id);

    this.logger.log(`설문조사 상세 조회 완료 - ID: ${id}`);

    return survey;
  }
}
