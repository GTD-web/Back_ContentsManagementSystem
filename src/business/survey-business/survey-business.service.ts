import { Injectable, Logger } from '@nestjs/common';
import { SurveyContextService } from '@context/survey-context/survey-context.service';
import {
  CreateSurveyDto,
  UpdateSurveyDto,
  CompleteSurveyDto,
} from '@context/survey-context/interfaces/survey-context.interface';
import { Survey } from '@domain/sub/survey/survey.entity';
import { SurveyCompletion } from '@domain/sub/survey/survey-completion.entity';

/**
 * 설문조사 비즈니스 서비스
 *
 * 설문조사 관련 비즈니스 로직을 오케스트레이션합니다.
 * - 컨텍스트 서비스 호출
 * - 여러 컨텍스트 간 조율
 */
@Injectable()
export class SurveyBusinessService {
  private readonly logger = new Logger(SurveyBusinessService.name);

  constructor(
    private readonly surveyContextService: SurveyContextService,
  ) {}

  /**
   * 설문조사 목록을 조회한다
   */
  async 설문조사_목록을_조회한다(params: {
    page?: number;
    limit?: number;
  }): Promise<{
    items: Survey[];
    total: number;
    page: number;
    limit: number;
  }> {
    this.logger.log('설문조사 목록 조회 시작');

    const result =
      await this.surveyContextService.설문조사_목록을_조회한다(params);

    this.logger.log(`설문조사 목록 조회 완료 - 총 ${result.total}개`);

    return result;
  }

  /**
   * 설문조사를 조회한다
   */
  async 설문조사를_조회한다(id: string): Promise<Survey> {
    this.logger.log(`설문조사 조회 시작 - ID: ${id}`);

    const survey = await this.surveyContextService.설문조사를_조회한다(id);

    this.logger.log(`설문조사 조회 완료 - ID: ${id}`);

    return survey;
  }

  /**
   * 공지사항의 설문조사를 조회한다
   */
  async 공지사항의_설문조사를_조회한다(
    announcementId: string,
  ): Promise<Survey | null> {
    this.logger.log(
      `공지사항의 설문조사 조회 시작 - 공지사항 ID: ${announcementId}`,
    );

    const survey =
      await this.surveyContextService.공지사항의_설문조사를_조회한다(
        announcementId,
      );

    this.logger.log(
      `공지사항의 설문조사 조회 완료 - 공지사항 ID: ${announcementId}`,
    );

    return survey;
  }

  /**
   * 설문조사를 생성한다
   */
  async 설문조사를_생성한다(data: CreateSurveyDto): Promise<Survey> {
    this.logger.log(
      `설문조사 생성 시작 - 공지사항 ID: ${data.announcementId}, 제목: ${data.title}`,
    );

    const result = await this.surveyContextService.설문조사를_생성한다(data);

    this.logger.log(`설문조사 생성 완료 - ID: ${result.id}`);

    // 생성 후 상세 정보 조회
    return await this.surveyContextService.설문조사를_조회한다(result.id);
  }

  /**
   * 설문조사를 수정한다
   */
  async 설문조사를_수정한다(
    id: string,
    data: UpdateSurveyDto,
  ): Promise<Survey> {
    this.logger.log(`설문조사 수정 시작 - ID: ${id}`);

    const result = await this.surveyContextService.설문조사를_수정한다(
      id,
      data,
    );

    this.logger.log(`설문조사 수정 완료 - ID: ${id}`);

    return result;
  }

  /**
   * 설문조사를 삭제한다
   */
  async 설문조사를_삭제한다(id: string): Promise<boolean> {
    this.logger.log(`설문조사 삭제 시작 - ID: ${id}`);

    const result = await this.surveyContextService.설문조사를_삭제한다(id);

    this.logger.log(`설문조사 삭제 완료 - ID: ${id}`);

    return result;
  }

  /**
   * 설문 완료를 기록한다
   */
  async 설문_완료를_기록한다(
    data: CompleteSurveyDto,
  ): Promise<SurveyCompletion> {
    this.logger.log(
      `설문 완료 기록 시작 - 설문 ID: ${data.surveyId}, 직원 사번: ${data.employeeNumber}`,
    );

    const result =
      await this.surveyContextService.설문_완료를_기록한다(data);

    this.logger.log(
      `설문 완료 기록 완료 - 설문 ID: ${data.surveyId}, 직원 사번: ${data.employeeNumber}`,
    );

    return result;
  }
}
