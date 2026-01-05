import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllSurveysQuery } from '../../queries/get-all-surveys.query';
import { SurveyService } from '@business/survey/survey.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { SurveyDto } from '@domain/sub/survey/survey.types';

@QueryHandler(GetAllSurveysQuery)
export class GetAllSurveysHandler implements IQueryHandler<GetAllSurveysQuery> {
  constructor(private readonly surveyService: SurveyService) {}

  async execute(query: GetAllSurveysQuery): Promise<ApiResponse<SurveyDto[]>> {
    return this.surveyService.설문조사_목록을_조회_한다();
  }
}
