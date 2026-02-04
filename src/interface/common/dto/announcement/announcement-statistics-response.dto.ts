import { ApiProperty } from '@nestjs/swagger';
import { InqueryType } from '@domain/sub/survey/inquery-type.types';

/**
 * 선택형 옵션 통계
 */
export class ChoiceOptionStatisticsDto {
  @ApiProperty({
    description: '옵션 텍스트',
    example: '매우 만족',
  })
  option: string;

  @ApiProperty({
    description: '선택 횟수',
    example: 15,
  })
  count: number;

  @ApiProperty({
    description: '선택 비율 (%)',
    example: 45.5,
  })
  percentage: number;
}

/**
 * 선택형 질문 통계 (multiple_choice, dropdown)
 */
export class ChoiceStatisticsDto {
  @ApiProperty({
    description: '통계 타입',
    example: 'choice',
  })
  type: 'choice';

  @ApiProperty({
    description: '옵션별 통계',
    type: [ChoiceOptionStatisticsDto],
  })
  options: ChoiceOptionStatisticsDto[];
}

/**
 * 체크박스 질문 통계 (checkboxes)
 */
export class CheckboxStatisticsDto {
  @ApiProperty({
    description: '통계 타입',
    example: 'checkbox',
  })
  type: 'checkbox';

  @ApiProperty({
    description: '옵션별 통계',
    type: [ChoiceOptionStatisticsDto],
  })
  options: ChoiceOptionStatisticsDto[];
}

/**
 * 척도 분포 통계
 */
export class ScaleDistributionDto {
  @ApiProperty({
    description: '척도 값',
    example: 7,
  })
  value: number;

  @ApiProperty({
    description: '응답 횟수',
    example: 12,
  })
  count: number;

  @ApiProperty({
    description: '응답 비율 (%)',
    example: 36.4,
  })
  percentage: number;
}

/**
 * 척도 질문 통계 (linear_scale)
 */
export class ScaleStatisticsDto {
  @ApiProperty({
    description: '통계 타입',
    example: 'scale',
  })
  type: 'scale';

  @ApiProperty({
    description: '평균값',
    example: 7.2,
  })
  average: number;

  @ApiProperty({
    description: '최소값',
    example: 1,
  })
  min: number;

  @ApiProperty({
    description: '최대값',
    example: 10,
  })
  max: number;

  @ApiProperty({
    description: '척도별 분포',
    type: [ScaleDistributionDto],
  })
  distribution: ScaleDistributionDto[];
}

/**
 * 텍스트 응답 아이템
 */
export class TextResponseItemDto {
  @ApiProperty({
    description: '직원 사번 (SSO employeeNumber)',
    example: '26002',
  })
  employeeId: string;

  @ApiProperty({
    description: '직원 이름',
    example: '홍길동',
  })
  employeeName: string;

  @ApiProperty({
    description: '텍스트 응답 내용',
    example: '제품 품질이 매우 우수합니다.',
  })
  textValue: string;

  @ApiProperty({
    description: '제출 일시',
    example: '2024-02-03T10:30:00Z',
  })
  submittedAt: Date;
}

/**
 * 텍스트 질문 통계 (short_answer, paragraph)
 */
export class TextStatisticsDto {
  @ApiProperty({
    description: '통계 타입',
    example: 'text',
  })
  type: 'text';

  @ApiProperty({
    description: '응답 횟수',
    example: 25,
  })
  responseCount: number;

  @ApiProperty({
    description: '실제 응답 내용 목록 (최신순)',
    type: [TextResponseItemDto],
  })
  responses: TextResponseItemDto[];
}

/**
 * 파일 응답 아이템
 */
export class FileResponseItemDto {
  @ApiProperty({
    description: '직원 사번 (SSO employeeNumber)',
    example: '26002',
  })
  employeeId: string;

  @ApiProperty({
    description: '직원 이름',
    example: '홍길동',
  })
  employeeName: string;

  @ApiProperty({
    description: '파일 URL',
    example:
      'https://lumir-admin.s3.ap-northeast-2.amazonaws.com/surveys/xxx.jpg',
  })
  fileUrl: string;

  @ApiProperty({
    description: '파일명',
    example: 'document.pdf',
  })
  fileName: string;

  @ApiProperty({
    description: '파일 크기 (bytes)',
    example: 102400,
  })
  fileSize: number;

  @ApiProperty({
    description: 'MIME 타입',
    example: 'application/pdf',
  })
  mimeType: string;

  @ApiProperty({
    description: '제출 일시',
    example: '2024-02-03T10:30:00Z',
  })
  submittedAt: Date;
}

/**
 * 파일 업로드 질문 통계 (file_upload)
 */
export class FileStatisticsDto {
  @ApiProperty({
    description: '통계 타입',
    example: 'file',
  })
  type: 'file';

  @ApiProperty({
    description: '응답 횟수',
    example: 10,
  })
  responseCount: number;

  @ApiProperty({
    description: '파일 응답 목록 (최신순)',
    type: [FileResponseItemDto],
  })
  responses: FileResponseItemDto[];
}

/**
 * 날짜/시간 응답 아이템
 */
export class DatetimeResponseItemDto {
  @ApiProperty({
    description: '직원 사번 (SSO employeeNumber)',
    example: '26002',
  })
  employeeId: string;

  @ApiProperty({
    description: '직원 이름',
    example: '홍길동',
  })
  employeeName: string;

  @ApiProperty({
    description: '날짜/시간 값',
    example: '2024-12-25T15:30:00Z',
  })
  datetimeValue: Date;

  @ApiProperty({
    description: '제출 일시',
    example: '2024-02-03T10:30:00Z',
  })
  submittedAt: Date;
}

/**
 * 날짜/시간 질문 통계 (datetime)
 */
export class DatetimeStatisticsDto {
  @ApiProperty({
    description: '통계 타입',
    example: 'datetime',
  })
  type: 'datetime';

  @ApiProperty({
    description: '응답 횟수',
    example: 8,
  })
  responseCount: number;

  @ApiProperty({
    description: '날짜/시간 응답 목록 (최신순)',
    type: [DatetimeResponseItemDto],
  })
  responses: DatetimeResponseItemDto[];
}

/**
 * 그리드 응답 아이템
 */
export class GridResponseItemDto {
  @ApiProperty({
    description: '직원 사번 (SSO employeeNumber)',
    example: '26002',
  })
  employeeId: string;

  @ApiProperty({
    description: '직원 이름',
    example: '홍길동',
  })
  employeeName: string;

  @ApiProperty({
    description: '행 이름',
    example: '서비스 품질',
  })
  rowName: string;

  @ApiProperty({
    description: '열 값',
    example: '매우 만족',
  })
  columnValue: string;

  @ApiProperty({
    description: '제출 일시',
    example: '2024-02-03T10:30:00Z',
  })
  submittedAt: Date;
}

/**
 * 그리드 질문 통계 (grid_scale)
 */
export class GridStatisticsDto {
  @ApiProperty({
    description: '통계 타입',
    example: 'grid',
  })
  type: 'grid';

  @ApiProperty({
    description: '응답 횟수',
    example: 12,
  })
  responseCount: number;

  @ApiProperty({
    description: '그리드 응답 목록 (최신순)',
    type: [GridResponseItemDto],
  })
  responses: GridResponseItemDto[];
}

/**
 * 질문별 통계 DTO
 */
export class QuestionStatisticsDto {
  @ApiProperty({
    description: '질문 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  questionId: string;

  @ApiProperty({
    description: '질문 제목',
    example: '서비스에 대한 만족도를 평가해주세요.',
  })
  title: string;

  @ApiProperty({
    description: '질문 타입',
    enum: InqueryType,
    example: InqueryType.LINEAR_SCALE,
  })
  type: InqueryType;

  @ApiProperty({
    description: '필수 응답 여부',
    example: true,
  })
  isRequired: boolean;

  @ApiProperty({
    description: '질문 순서',
    example: 1,
  })
  order: number;

  @ApiProperty({
    description: '총 응답 수',
    example: 33,
  })
  totalResponses: number;

  @ApiProperty({
    description: '질문 타입별 통계 데이터',
    oneOf: [
      { $ref: '#/components/schemas/ChoiceStatisticsDto' },
      { $ref: '#/components/schemas/CheckboxStatisticsDto' },
      { $ref: '#/components/schemas/ScaleStatisticsDto' },
      { $ref: '#/components/schemas/TextStatisticsDto' },
      { $ref: '#/components/schemas/FileStatisticsDto' },
      { $ref: '#/components/schemas/DatetimeStatisticsDto' },
      { $ref: '#/components/schemas/GridStatisticsDto' },
    ],
  })
  statistics:
    | ChoiceStatisticsDto
    | CheckboxStatisticsDto
    | ScaleStatisticsDto
    | TextStatisticsDto
    | FileStatisticsDto
    | DatetimeStatisticsDto
    | GridStatisticsDto;
}

/**
 * 공지사항 설문조사 통계 응답 DTO
 */
export class AnnouncementSurveyStatisticsResponseDto {
  @ApiProperty({
    description: '설문조사 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  surveyId: string;

  @ApiProperty({
    description: '설문조사 제목',
    example: '2024년 직원 만족도 조사',
  })
  surveyTitle: string;

  @ApiProperty({
    description: '총 완료자 수',
    example: 33,
  })
  totalCompletions: number;

  @ApiProperty({
    description: '질문별 통계',
    type: [QuestionStatisticsDto],
  })
  questions: QuestionStatisticsDto[];
}
