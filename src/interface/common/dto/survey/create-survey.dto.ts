import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsDateString,
  ValidateNested,
  IsBoolean,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InqueryType } from '@domain/sub/survey/inquery-type.types';

/**
 * 설문 질문 폼 데이터 DTO
 */
export class SurveyQuestionFormDto {
  @ApiProperty({
    description: '선택지 목록 (객관식, 드롭다운, 체크박스)',
    type: [String],
    example: ['선택지 1', '선택지 2', '선택지 3'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @ApiProperty({
    description: '최소 척도 (선형 척도)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  minScale?: number;

  @ApiProperty({
    description: '최대 척도 (선형 척도)',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  maxScale?: number;

  @ApiProperty({
    description: '행 목록 (그리드 척도)',
    type: [String],
    example: ['행 1', '행 2'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  rows?: string[];

  @ApiProperty({
    description: '열 목록 (그리드 척도)',
    type: [String],
    example: ['열 1', '열 2'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  columns?: string[];

  @ApiProperty({
    description: '허용된 파일 타입 (파일 업로드)',
    type: [String],
    example: ['image/jpeg', 'image/png', 'application/pdf'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedFileTypes?: string[];

  @ApiProperty({
    description: '최대 파일 크기 (파일 업로드, bytes)',
    example: 5242880,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  maxFileSize?: number;
}

/**
 * 설문 질문 DTO
 */
export class SurveyQuestionDto {
  @ApiProperty({
    description: '질문 제목',
    example: '만족도를 평가해주세요',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: '질문 타입',
    enum: InqueryType,
    example: InqueryType.MULTIPLE_CHOICE,
  })
  @IsEnum(InqueryType)
  type: InqueryType;

  @ApiProperty({
    description: '질문 폼 데이터 (타입별 옵션)',
    type: SurveyQuestionFormDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SurveyQuestionFormDto)
  form?: SurveyQuestionFormDto;

  @ApiProperty({
    description: '필수 응답 여부',
    example: true,
    default: false,
  })
  @IsBoolean()
  isRequired: boolean;

  @ApiProperty({
    description: '질문 정렬 순서',
    example: 0,
    default: 0,
  })
  @IsNumber()
  order: number;
}

/**
 * 설문조사 생성 DTO (독립 생성용)
 */
export class CreateSurveyDto {
  @ApiProperty({
    description: '공지사항 ID',
    example: 'uuid-announcement-id',
  })
  @IsString()
  announcementId: string;

  @ApiProperty({
    description: '설문조사 제목',
    example: '2024년 직원 만족도 조사',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: '설문조사 설명',
    example: '우리 회사의 발전을 위한 소중한 의견을 들려주세요.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: '설문 시작 일시',
    example: '2024-01-01T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: '설문 마감 일시',
    example: '2024-12-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: '정렬 순서',
    example: 0,
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({
    description: '설문 질문 목록',
    type: [SurveyQuestionDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SurveyQuestionDto)
  questions?: SurveyQuestionDto[];
}

/**
 * 설문조사 생성 DTO (공지사항 포함용 - announcementId 제외)
 */
export class CreateSurveyWithoutAnnouncementDto {
  @ApiProperty({
    description: '설문조사 제목',
    example: '2024년 직원 만족도 조사',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: '설문조사 설명',
    example: '우리 회사의 발전을 위한 소중한 의견을 들려주세요.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: '설문 시작 일시',
    example: '2024-01-01T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: '설문 마감 일시',
    example: '2024-12-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: '정렬 순서',
    example: 0,
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({
    description: '설문 질문 목록',
    type: [SurveyQuestionDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SurveyQuestionDto)
  questions?: SurveyQuestionDto[];
}
