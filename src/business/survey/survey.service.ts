import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from '@domain/sub/survey/survey.entity';
import type { SurveyDto } from '@domain/sub/survey/survey.types';
import type { Inquery } from '@domain/sub/survey/inquery.types';
import {
  successResponse,
  type ApiResponse,
} from '@domain/common/types/api-response.types';

/**
 * 설문조사 비즈니스 서비스
 *
 * @description
 * - Survey Entity와 SurveyDto 간의 변환을 담당합니다.
 * - 설문조사 관련 비즈니스 로직을 처리합니다.
 * - 질문 관리, 응답 수집 등의 기능을 제공합니다.
 */
@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
  ) {}

  /**
   * 설문조사 목록을 조회한다
   */
  async 설문조사_목록을_조회_한다(): Promise<ApiResponse<SurveyDto[]>> {
    const surveys = await this.surveyRepository.find({
      relations: ['manager'],
      order: {
        createdAt: 'DESC',
      },
    });

    const surveyDtos = surveys.map((survey) => survey.DTO로_변환한다());

    return successResponse(
      surveyDtos,
      '설문조사 목록을 성공적으로 조회했습니다.',
    );
  }

  /**
   * 설문조사 상세 정보를 조회한다
   */
  async 설문조사를_조회_한다(surveyId: string): Promise<ApiResponse<SurveyDto>> {
    const survey = await this.surveyRepository.findOne({
      where: { id: surveyId },
      relations: ['manager'],
    });

    if (!survey) {
      throw new Error(`설문조사를 찾을 수 없습니다. ID: ${surveyId}`);
    }

    return successResponse(
      survey.DTO로_변환한다(),
      '설문조사 정보를 성공적으로 조회했습니다.',
    );
  }

  /**
   * 설문조사를 생성한다
   */
  async 설문조사를_생성_한다(
    data: Partial<SurveyDto>,
  ): Promise<ApiResponse<SurveyDto>> {
    const survey = this.surveyRepository.create(data as any);
    const savedSurvey = await this.surveyRepository.save(survey);
    
    const result = Array.isArray(savedSurvey) ? savedSurvey[0] : savedSurvey;

    return successResponse(
      result.DTO로_변환한다(),
      '설문조사가 성공적으로 생성되었습니다.',
    );
  }

  /**
   * 설문조사를 수정한다
   */
  async 설문조사를_수정_한다(
    surveyId: string,
    data: Partial<SurveyDto>,
  ): Promise<ApiResponse<SurveyDto>> {
    const survey = await this.surveyRepository.findOne({
      where: { id: surveyId },
      relations: ['manager'],
    });

    if (!survey) {
      throw new Error(`설문조사를 찾을 수 없습니다. ID: ${surveyId}`);
    }

    Object.assign(survey, data);
    const updatedSurvey = await this.surveyRepository.save(survey);

    return successResponse(
      updatedSurvey.DTO로_변환한다(),
      '설문조사가 성공적으로 수정되었습니다.',
    );
  }

  /**
   * 설문조사를 삭제한다 (Soft Delete)
   */
  async 설문조사를_삭제_한다(surveyId: string): Promise<ApiResponse<void>> {
    const result = await this.surveyRepository.softDelete(surveyId);

    if (result.affected === 0) {
      throw new Error(`설문조사를 찾을 수 없습니다. ID: ${surveyId}`);
    }

    return successResponse(
      undefined as any,
      '설문조사가 성공적으로 삭제되었습니다.',
    );
  }

  /**
   * 질문을 추가한다
   */
  async 질문을_추가_한다(
    surveyId: string,
    inquery: Inquery,
  ): Promise<ApiResponse<SurveyDto>> {
    const survey = await this.surveyRepository.findOne({
      where: { id: surveyId },
      relations: ['manager'],
    });

    if (!survey) {
      throw new Error(`설문조사를 찾을 수 없습니다. ID: ${surveyId}`);
    }

    survey.질문을_추가한다(inquery);
    const updatedSurvey = await this.surveyRepository.save(survey);

    return successResponse(
      updatedSurvey.DTO로_변환한다(),
      '질문이 성공적으로 추가되었습니다.',
    );
  }

  /**
   * 질문을 삭제한다
   */
  async 질문을_삭제_한다(
    surveyId: string,
    inqueryId: string,
  ): Promise<ApiResponse<SurveyDto>> {
    const survey = await this.surveyRepository.findOne({
      where: { id: surveyId },
      relations: ['manager'],
    });

    if (!survey) {
      throw new Error(`설문조사를 찾을 수 없습니다. ID: ${surveyId}`);
    }

    survey.질문을_제거한다(inqueryId);
    const updatedSurvey = await this.surveyRepository.save(survey);

    return successResponse(
      updatedSurvey.DTO로_변환한다(),
      '질문이 성공적으로 삭제되었습니다.',
    );
  }

  /**
   * 설문조사를 공개한다
   */
  async 설문조사를_공개한다(surveyId: string): Promise<ApiResponse<SurveyDto>> {
    const survey = await this.surveyRepository.findOne({
      where: { id: surveyId },
      relations: ['manager'],
    });

    if (!survey) {
      throw new Error(`설문조사를 찾을 수 없습니다. ID: ${surveyId}`);
    }

    survey.공개한다();
    const updatedSurvey = await this.surveyRepository.save(survey);

    return successResponse(
      updatedSurvey.DTO로_변환한다(),
      '설문조사가 성공적으로 공개되었습니다.',
    );
  }

  /**
   * 설문조사를 비공개한다
   */
  async 설문조사를_비공개한다(
    surveyId: string,
  ): Promise<ApiResponse<SurveyDto>> {
    const survey = await this.surveyRepository.findOne({
      where: { id: surveyId },
      relations: ['manager'],
    });

    if (!survey) {
      throw new Error(`설문조사를 찾을 수 없습니다. ID: ${surveyId}`);
    }

    survey.비공개한다();
    const updatedSurvey = await this.surveyRepository.save(survey);

    return successResponse(
      updatedSurvey.DTO로_변환한다(),
      '설문조사가 성공적으로 비공개되었습니다.',
    );
  }
}
