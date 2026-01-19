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
    ],
  })
  statistics:
    | ChoiceStatisticsDto
    | CheckboxStatisticsDto
    | ScaleStatisticsDto
    | TextStatisticsDto;
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
