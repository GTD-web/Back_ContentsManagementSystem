import { Survey } from '@domain/sub/survey/survey.entity';
import { InqueryType } from '@domain/sub/survey/inquery-type.types';

/**
 * 설문 질문 DTO
 */
export interface SurveyQuestionDto {
  title: string;
  type: InqueryType;
  form?: {
    options?: string[];
    minScale?: number;
    maxScale?: number;
    rows?: string[];
    columns?: string[];
    allowedFileTypes?: string[];
    maxFileSize?: number;
  } | null;
  isRequired: boolean;
  order: number;
}

/**
 * 설문조사 생성 DTO
 */
export interface CreateSurveyDto {
  announcementId: string;
  title: string;
  description?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  order?: number;
  questions?: SurveyQuestionDto[];
}

/**
 * 설문조사 수정 DTO
 */
export interface UpdateSurveyDto {
  title?: string;
  description?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  order?: number;
  questions?: SurveyQuestionDto[];
}

/**
 * 설문 응답 제출 DTO
 */
export interface SubmitSurveyResponseDto {
  surveyId: string;
  employeeId: string;
  responses: Array<{
    questionId: string;
    responseType: InqueryType;
    responseData: any;
  }>;
}

/**
 * 설문 완료 DTO
 */
export interface CompleteSurveyDto {
  surveyId: string;
  employeeId: string;
  employeeNumber: string;
}

/**
 * 설문조사 생성 결과
 */
export interface CreateSurveyResult {
  id: string;
  announcementId: string;
  title: string;
  createdAt: Date;
}

/**
 * 설문조사 목록 조회 결과
 */
export interface SurveyListResult {
  items: Survey[];
  total: number;
  page: number;
  limit: number;
}

/**
 * 설문조사 상세 조회 결과
 */
export interface SurveyDetailResult extends Survey {}

/**
 * 설문 통계 결과
 */
export interface SurveyStatisticsResult {
  surveyId: string;
  totalTargetCount: number;
  completedCount: number;
  completionRate: number;
  questionStatistics: Array<{
    questionId: string;
    questionTitle: string;
    questionType: InqueryType;
    responseCount: number;
    responses: any;
  }>;
}
