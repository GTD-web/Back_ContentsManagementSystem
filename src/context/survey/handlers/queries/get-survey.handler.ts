import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSurveyQuery } from '../../queries/get-survey.query';
import { SurveyService } from '@business/survey/survey.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { SurveyDto } from '@domain/sub/survey/survey.types';

@QueryHandler(GetSurveyQuery)
export class GetSurveyHandler implements IQueryHandler<GetSurveyQuery> {
  constructor(private readonly surveyService: SurveyService) {}

  async execute(query: GetSurveyQuery): Promise<ApiResponse<SurveyDto>> {
    return this.surveyService.설문조사를_조회_한다(query.surveyId);
  }
}
