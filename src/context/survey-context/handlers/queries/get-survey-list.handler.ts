import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SurveyService } from '@domain/sub/survey/survey.service';
import { SurveyListResult } from '../../interfaces/survey-context.interface';
import { Logger } from '@nestjs/common';

/**
 * 설문조사 목록 조회 쿼리
 */
export class GetSurveyListQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
  ) {}
}

/**
 * 설문조사 목록 조회 핸들러
 */
@QueryHandler(GetSurveyListQuery)
export class GetSurveyListHandler implements IQueryHandler<GetSurveyListQuery> {
  private readonly logger = new Logger(GetSurveyListHandler.name);

  constructor(private readonly surveyService: SurveyService) {}

  async execute(query: GetSurveyListQuery): Promise<SurveyListResult> {
    const { page, limit } = query;

    this.logger.log(`설문조사 목록 조회 시작 - 페이지: ${page}, 제한: ${limit}`);

    const surveys = await this.surveyService.모든_설문조사를_조회한다();

    // 페이지네이션 적용
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = surveys.slice(startIndex, endIndex);

    const result = {
      items: paginatedItems,
      total: surveys.length,
      page,
      limit,
    };

    this.logger.log(`설문조사 목록 조회 완료 - 총 ${result.total}개`);

    return result;
  }
}
