import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger, NotFoundException } from '@nestjs/common';
import { Survey } from '@domain/sub/survey/survey.entity';
import { SurveyQuestion } from '@domain/sub/survey/survey-question.entity';
import { SurveyCompletion } from '@domain/sub/survey/survey-completion.entity';
import { SurveyResponseChoice } from '@domain/sub/survey/responses/survey-response-choice.entity';
import { SurveyResponseCheckbox } from '@domain/sub/survey/responses/survey-response-checkbox.entity';
import { SurveyResponseScale } from '@domain/sub/survey/responses/survey-response-scale.entity';
import { SurveyResponseText } from '@domain/sub/survey/responses/survey-response-text.entity';
import { SurveyResponseFile } from '@domain/sub/survey/responses/survey-response-file.entity';
import { SurveyResponseDatetime } from '@domain/sub/survey/responses/survey-response-datetime.entity';
import { SurveyResponseGrid } from '@domain/sub/survey/responses/survey-response-grid.entity';
import { InqueryType } from '@domain/sub/survey/inquery-type.types';
import { CompanyContextService } from '@context/company-context/company-context.service';

/**
 * 설문조사 통계 조회 쿼리
 */
export class GetSurveyStatisticsQuery {
  constructor(public readonly announcementId: string) {}
}

/**
 * 질문별 통계 데이터
 */
export interface QuestionStatistics {
  questionId: string;
  title: string;
  type: InqueryType;
  isRequired: boolean;
  order: number;
  totalResponses: number;
  statistics:
    | ChoiceStatistics
    | CheckboxStatistics
    | ScaleStatistics
    | TextStatistics
    | FileStatistics
    | DatetimeStatistics
    | GridStatistics;
}

/**
 * 선택형 질문 통계 (multiple_choice, dropdown)
 */
export interface ChoiceStatistics {
  type: 'choice';
  options: {
    option: string;
    count: number;
    percentage: number;
  }[];
  responses: ChoiceResponseItem[];
}

/**
 * 체크박스 질문 통계 (checkboxes)
 */
export interface CheckboxStatistics {
  type: 'checkbox';
  options: {
    option: string;
    count: number;
    percentage: number;
  }[];
  responses: CheckboxResponseItem[];
}

/**
 * 척도 질문 통계 (linear_scale)
 */
export interface ScaleStatistics {
  type: 'scale';
  average: number;
  min: number;
  max: number;
  distribution: {
    value: number;
    count: number;
    percentage: number;
  }[];
  responses: ScaleResponseItem[];
}

/**
 * 선택형 응답 아이템
 */
export interface ChoiceResponseItem {
  employeeNumber: string;
  employeeName: string;
  selectedOption: string;
  submittedAt: Date;
}

/**
 * 체크박스 응답 아이템
 */
export interface CheckboxResponseItem {
  employeeNumber: string;
  employeeName: string;
  selectedOption: string;
  submittedAt: Date;
}

/**
 * 척도 응답 아이템
 */
export interface ScaleResponseItem {
  employeeNumber: string;
  employeeName: string;
  scaleValue: number;
  submittedAt: Date;
}

/**
 * 텍스트 응답 아이템
 */
export interface TextResponseItem {
  employeeNumber: string;
  employeeName: string;
  textValue: string;
  submittedAt: Date;
}

/**
 * 텍스트 질문 통계 (short_answer, paragraph)
 */
export interface TextStatistics {
  type: 'text';
  responseCount: number;
  responses: TextResponseItem[]; // ✅ 실제 응답 내용 추가
}

/**
 * 파일 응답 아이템
 */
export interface FileResponseItem {
  employeeNumber: string;
  employeeName: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  submittedAt: Date;
}

/**
 * 파일 업로드 질문 통계 (file_upload)
 */
export interface FileStatistics {
  type: 'file';
  responseCount: number;
  responses: FileResponseItem[];
}

/**
 * 날짜/시간 응답 아이템
 */
export interface DatetimeResponseItem {
  employeeNumber: string;
  employeeName: string;
  datetimeValue: Date;
  submittedAt: Date;
}

/**
 * 날짜/시간 질문 통계 (datetime)
 */
export interface DatetimeStatistics {
  type: 'datetime';
  responseCount: number;
  responses: DatetimeResponseItem[];
}

/**
 * 그리드 응답 아이템
 */
export interface GridResponseItem {
  employeeNumber: string;
  employeeName: string;
  rowName: string;
  columnValue: string;
  submittedAt: Date;
}

/**
 * 그리드 질문 통계 (grid_scale)
 */
export interface GridStatistics {
  type: 'grid';
  responseCount: number;
  responses: GridResponseItem[];
}

/**
 * 설문조사 통계 결과
 */
export interface SurveyStatisticsResult {
  surveyId: string;
  surveyTitle: string;
  totalCompletions: number;
  questions: QuestionStatistics[];
}

/**
 * 설문조사 통계 조회 핸들러
 */
@QueryHandler(GetSurveyStatisticsQuery)
export class GetSurveyStatisticsHandler
  implements IQueryHandler<GetSurveyStatisticsQuery>
{
  private readonly logger = new Logger(GetSurveyStatisticsHandler.name);

  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
    @InjectRepository(SurveyQuestion)
    private readonly questionRepository: Repository<SurveyQuestion>,
    @InjectRepository(SurveyCompletion)
    private readonly completionRepository: Repository<SurveyCompletion>,
    @InjectRepository(SurveyResponseChoice)
    private readonly responseChoiceRepository: Repository<SurveyResponseChoice>,
    @InjectRepository(SurveyResponseCheckbox)
    private readonly responseCheckboxRepository: Repository<SurveyResponseCheckbox>,
    @InjectRepository(SurveyResponseScale)
    private readonly responseScaleRepository: Repository<SurveyResponseScale>,
    @InjectRepository(SurveyResponseText)
    private readonly responseTextRepository: Repository<SurveyResponseText>,
    @InjectRepository(SurveyResponseFile)
    private readonly responseFileRepository: Repository<SurveyResponseFile>,
    @InjectRepository(SurveyResponseDatetime)
    private readonly responseDatetimeRepository: Repository<SurveyResponseDatetime>,
    @InjectRepository(SurveyResponseGrid)
    private readonly responseGridRepository: Repository<SurveyResponseGrid>,
    private readonly companyContextService: CompanyContextService,
  ) {}

  async execute(
    query: GetSurveyStatisticsQuery,
  ): Promise<SurveyStatisticsResult> {
    const { announcementId } = query;

    this.logger.log(
      `설문조사 통계 조회 시작 - 공지사항 ID: ${announcementId}`,
    );

    // 1. 설문조사 조회
    const survey = await this.surveyRepository.findOne({
      where: { announcementId },
      relations: ['questions'],
    });

    if (!survey) {
      throw new NotFoundException(
        `해당 공지사항에 연결된 설문조사가 없습니다. 공지사항 ID: ${announcementId}`,
      );
    }

    // 2. 완료자 수 조회
    const totalCompletions = await this.completionRepository.count({
      where: { surveyId: survey.id, isCompleted: true },
    });

    // 3. 조직 정보 조회 (직원 이름 매핑용)
    const employeeNameMap = await this.직원_이름_매핑을_생성한다();

    // 4. 질문별 통계 수집
    const questions = await Promise.all(
      survey.questions
        .sort((a, b) => a.order - b.order)
        .map((question) => this.질문별_통계를_수집한다(question, employeeNameMap)),
    );

    this.logger.log(`설문조사 통계 조회 완료 - 설문 ID: ${survey.id}`);

    return {
      surveyId: survey.id,
      surveyTitle: survey.title,
      totalCompletions,
      questions,
    };
  }

  /**
   * 직원 이름 매핑을 생성한다 (사번 -> 이름)
   * @private
   */
  private async 직원_이름_매핑을_생성한다(): Promise<Map<string, string>> {
    try {
      const orgInfo = await this.companyContextService.조직_정보를_가져온다(true);
      const employeeNameMap = new Map<string, string>();

      const extractFromDept = (dept: any) => {
        if (dept.employees) {
          dept.employees.forEach((emp: any) => {
            if (emp.employeeNumber) {
              employeeNameMap.set(emp.employeeNumber, emp.name || '알 수 없음');
            }
          });
        }
        
        const children = dept.childDepartments || dept.children;
        if (children) {
          children.forEach((child: any) => extractFromDept(child));
        }
      };

      if (orgInfo.departments) {
        orgInfo.departments.forEach((dept) => extractFromDept(dept));
      }

      this.logger.debug(`직원 이름 매핑 생성 완료 - 총 ${employeeNameMap.size}명`);
      return employeeNameMap;
    } catch (error) {
      this.logger.error('직원 이름 매핑 생성 실패', error.stack);
      return new Map<string, string>();
    }
  }

  /**
   * 질문별 통계를 수집한다
   */
  private async 질문별_통계를_수집한다(
    question: SurveyQuestion,
    employeeNameMap: Map<string, string>,
  ): Promise<QuestionStatistics> {
    let statistics:
      | ChoiceStatistics
      | CheckboxStatistics
      | ScaleStatistics
      | TextStatistics
      | FileStatistics
      | DatetimeStatistics
      | GridStatistics;
    let totalResponses = 0;

    switch (question.type) {
      case InqueryType.MULTIPLE_CHOICE:
      case InqueryType.DROPDOWN:
        const choiceData = await this.선택형_통계를_수집한다(question, employeeNameMap);
        statistics = choiceData.statistics;
        totalResponses = choiceData.totalResponses;
        break;

      case InqueryType.CHECKBOXES:
        const checkboxData = await this.체크박스_통계를_수집한다(question, employeeNameMap);
        statistics = checkboxData.statistics;
        totalResponses = checkboxData.totalResponses;
        break;

      case InqueryType.LINEAR_SCALE:
        const scaleData = await this.척도_통계를_수집한다(question, employeeNameMap);
        statistics = scaleData.statistics;
        totalResponses = scaleData.totalResponses;
        break;

      case InqueryType.SHORT_ANSWER:
      case InqueryType.PARAGRAPH:
        const textData = await this.텍스트_통계를_수집한다(question, employeeNameMap);
        statistics = textData.statistics;
        totalResponses = textData.totalResponses;
        break;

      case InqueryType.FILE_UPLOAD:
        const fileData = await this.파일_통계를_수집한다(question, employeeNameMap);
        statistics = fileData.statistics;
        totalResponses = fileData.totalResponses;
        break;

      case InqueryType.DATETIME:
        const datetimeData = await this.날짜시간_통계를_수집한다(question, employeeNameMap);
        statistics = datetimeData.statistics;
        totalResponses = datetimeData.totalResponses;
        break;

      case InqueryType.GRID_SCALE:
        const gridData = await this.그리드_통계를_수집한다(question, employeeNameMap);
        statistics = gridData.statistics;
        totalResponses = gridData.totalResponses;
        break;

      default:
        // 알 수 없는 타입은 빈 텍스트 통계로 처리
        statistics = { type: 'text', responseCount: 0, responses: [] };
        totalResponses = 0;
    }

    return {
      questionId: question.id,
      title: question.title,
      type: question.type,
      isRequired: question.isRequired,
      order: question.order,
      totalResponses,
      statistics,
    };
  }

  /**
   * 선택형 질문 통계를 수집한다 (multiple_choice, dropdown)
   */
  private async 선택형_통계를_수집한다(
    question: SurveyQuestion,
    employeeNameMap: Map<string, string>,
  ): Promise<{
    statistics: ChoiceStatistics;
    totalResponses: number;
  }> {
    const responses = await this.responseChoiceRepository.find({
      where: { questionId: question.id },
      order: { submittedAt: 'DESC' }, // 최신순 정렬
    });

    const totalResponses = responses.length;

    // 옵션별 응답 수 집계
    const optionCounts = new Map<string, number>();
    responses.forEach((response) => {
      const count = optionCounts.get(response.selectedOption) || 0;
      optionCounts.set(response.selectedOption, count + 1);
    });

    // 질문의 모든 옵션을 포함 (응답 없는 옵션도 포함)
    const allOptions = question.form?.options || [];
    const options = allOptions.map((option) => ({
      option,
      count: optionCounts.get(option) || 0,
      percentage: totalResponses > 0 ? ((optionCounts.get(option) || 0) / totalResponses) * 100 : 0,
    }));

    // 응답 수 많은 순으로 정렬 (동일하면 원래 순서 유지)
    options.sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      // count가 같으면 원래 순서 유지
      return allOptions.indexOf(a.option) - allOptions.indexOf(b.option);
    });

    return {
      statistics: {
        type: 'choice',
        options,
        responses: responses.map((r) => ({
          employeeNumber: r.employeeNumber || r.employeeId,
          employeeName: employeeNameMap.get(r.employeeNumber) || '알 수 없음',
          selectedOption: r.selectedOption,
          submittedAt: r.submittedAt,
        })),
      },
      totalResponses,
    };
  }

  /**
   * 체크박스 질문 통계를 수집한다 (checkboxes)
   */
  private async 체크박스_통계를_수집한다(
    question: SurveyQuestion,
    employeeNameMap: Map<string, string>,
  ): Promise<{
    statistics: CheckboxStatistics;
    totalResponses: number;
  }> {
    const responses = await this.responseCheckboxRepository.find({
      where: { questionId: question.id },
      order: { submittedAt: 'DESC' }, // 최신순 정렬
    });

    // 응답한 고유 직원 수
    const uniqueEmployees = new Set(responses.map((r) => r.employeeNumber || r.employeeId));
    const totalResponses = uniqueEmployees.size;

    // 옵션별 선택 수 집계
    const optionCounts = new Map<string, number>();
    responses.forEach((response) => {
      const count = optionCounts.get(response.selectedOption) || 0;
      optionCounts.set(response.selectedOption, count + 1);
    });

    // 질문의 모든 옵션을 포함 (응답 없는 옵션도 포함)
    const allOptions = question.form?.options || [];
    const options = allOptions.map((option) => ({
      option,
      count: optionCounts.get(option) || 0,
      percentage: totalResponses > 0 ? ((optionCounts.get(option) || 0) / totalResponses) * 100 : 0,
    }));

    // 선택 수 많은 순으로 정렬 (동일하면 원래 순서 유지)
    options.sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      // count가 같으면 원래 순서 유지
      return allOptions.indexOf(a.option) - allOptions.indexOf(b.option);
    });

    return {
      statistics: {
        type: 'checkbox',
        options,
        responses: responses.map((r) => ({
          employeeNumber: r.employeeNumber || r.employeeId,
          employeeName: employeeNameMap.get(r.employeeNumber) || '알 수 없음',
          selectedOption: r.selectedOption,
          submittedAt: r.submittedAt,
        })),
      },
      totalResponses,
    };
  }

  /**
   * 척도 질문 통계를 수집한다 (linear_scale)
   */
  private async 척도_통계를_수집한다(
    question: SurveyQuestion,
    employeeNameMap: Map<string, string>,
  ): Promise<{
    statistics: ScaleStatistics;
    totalResponses: number;
  }> {
    const responses = await this.responseScaleRepository.find({
      where: { questionId: question.id },
      order: { submittedAt: 'DESC' }, // 최신순 정렬
    });

    const totalResponses = responses.length;

    if (totalResponses === 0) {
      return {
        statistics: {
          type: 'scale',
          average: 0,
          min: 0,
          max: 0,
          distribution: [],
          responses: [],
        },
        totalResponses: 0,
      };
    }

    // 평균, 최소, 최대값 계산
    const values = responses.map((r) => r.scaleValue);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const average = sum / totalResponses;
    const min = Math.min(...values);
    const max = Math.max(...values);

    // 척도값별 응답 수 집계
    const valueCounts = new Map<number, number>();
    responses.forEach((response) => {
      const count = valueCounts.get(response.scaleValue) || 0;
      valueCounts.set(response.scaleValue, count + 1);
    });

    // 결과 배열 생성
    const distribution = Array.from(valueCounts.entries())
      .map(([value, count]) => ({
        value,
        count,
        percentage: (count / totalResponses) * 100,
      }))
      .sort((a, b) => a.value - b.value); // 척도값 오름차순 정렬

    return {
      statistics: {
        type: 'scale',
        average: Math.round(average * 100) / 100, // 소수점 2자리
        min,
        max,
        distribution,
        responses: responses.map((r) => ({
          employeeNumber: r.employeeNumber || r.employeeId,
          employeeName: employeeNameMap.get(r.employeeNumber) || '알 수 없음',
          scaleValue: r.scaleValue,
          submittedAt: r.submittedAt,
        })),
      },
      totalResponses,
    };
  }

  /**
   * 텍스트 질문 통계를 수집한다 (short_answer, paragraph)
   */
  private async 텍스트_통계를_수집한다(
    question: SurveyQuestion,
    employeeNameMap: Map<string, string>,
  ): Promise<{
    statistics: TextStatistics;
    totalResponses: number;
  }> {
    const responses = await this.responseTextRepository.find({
      where: { questionId: question.id },
      order: { submittedAt: 'DESC' }, // 최신순 정렬
    });

    const totalResponses = responses.length;

    return {
      statistics: {
        type: 'text',
        responseCount: totalResponses,
        responses: responses.map((r) => ({
          employeeNumber: r.employeeNumber || r.employeeId,
          employeeName: employeeNameMap.get(r.employeeNumber) || '알 수 없음',
          textValue: r.textValue,
          submittedAt: r.submittedAt,
        })),
      },
      totalResponses,
    };
  }

  /**
   * 파일 업로드 질문 통계를 수집한다 (file_upload)
   */
  private async 파일_통계를_수집한다(
    question: SurveyQuestion,
    employeeNameMap: Map<string, string>,
  ): Promise<{
    statistics: FileStatistics;
    totalResponses: number;
  }> {
    const responses = await this.responseFileRepository.find({
      where: { questionId: question.id },
      order: { submittedAt: 'DESC' }, // 최신순 정렬
    });

    // totalResponses: 응답한 고유 직원 수 (1명이 여러 파일 업로드 가능)
    const uniqueEmployees = new Set(responses.map((r) => r.employeeNumber || r.employeeId));
    const totalResponses = uniqueEmployees.size;

    // responseCount: 업로드된 총 파일 개수
    const responseCount = responses.length;

    return {
      statistics: {
        type: 'file',
        responseCount,
        responses: responses.map((r) => ({
          employeeNumber: r.employeeNumber || r.employeeId,
          employeeName: employeeNameMap.get(r.employeeNumber) || '알 수 없음',
          fileUrl: r.fileUrl,
          fileName: r.fileName,
          fileSize: r.fileSize,
          mimeType: r.mimeType,
          submittedAt: r.submittedAt,
        })),
      },
      totalResponses,
    };
  }

  /**
   * 날짜/시간 질문 통계를 수집한다 (datetime)
   */
  private async 날짜시간_통계를_수집한다(
    question: SurveyQuestion,
    employeeNameMap: Map<string, string>,
  ): Promise<{
    statistics: DatetimeStatistics;
    totalResponses: number;
  }> {
    const responses = await this.responseDatetimeRepository.find({
      where: { questionId: question.id },
      order: { submittedAt: 'DESC' }, // 최신순 정렬
    });

    const totalResponses = responses.length;

    return {
      statistics: {
        type: 'datetime',
        responseCount: totalResponses,
        responses: responses.map((r) => ({
          employeeNumber: r.employeeNumber || r.employeeId,
          employeeName: employeeNameMap.get(r.employeeNumber) || '알 수 없음',
          datetimeValue: r.datetimeValue,
          submittedAt: r.submittedAt,
        })),
      },
      totalResponses,
    };
  }

  /**
   * 그리드 질문 통계를 수집한다 (grid_scale)
   */
  private async 그리드_통계를_수집한다(
    question: SurveyQuestion,
    employeeNameMap: Map<string, string>,
  ): Promise<{
    statistics: GridStatistics;
    totalResponses: number;
  }> {
    const responses = await this.responseGridRepository.find({
      where: { questionId: question.id },
      order: { submittedAt: 'DESC' }, // 최신순 정렬
    });

    // 응답한 고유 직원 수
    const uniqueEmployees = new Set(responses.map((r) => r.employeeNumber || r.employeeId));
    const totalResponses = uniqueEmployees.size;

    return {
      statistics: {
        type: 'grid',
        responseCount: totalResponses,
        responses: responses.map((r) => ({
          employeeNumber: r.employeeNumber || r.employeeId,
          employeeName: employeeNameMap.get(r.employeeNumber) || '알 수 없음',
          rowName: r.rowName,
          columnValue: r.columnValue,
          submittedAt: r.submittedAt,
        })),
      },
      totalResponses,
    };
  }
}
