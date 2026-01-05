import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsObject, IsArray, IsBoolean } from 'class-validator';
import type { SurveyCategory, SurveyStatus } from '@domain/core/common/types';
import type { InqueryType } from '@domain/sub/survey/inquery.types';

export class CreateInqueryDto {
  @ApiProperty({ description: '질문 제목' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: '질문 타입', enum: ['short_answer', 'paragraph', 'multiple_choice', 'dropdown', 'checkboxes', 'file_upload', 'datetime', 'linear_scale', 'grid_scale'] })
  @IsNotEmpty()
  @IsString()
  type: InqueryType;

  @ApiProperty({ description: '질문 폼 데이터' })
  @IsNotEmpty()
  @IsObject()
  form: any;

  @ApiProperty({ description: '필수 여부', default: false })
  @IsBoolean()
  isRequired: boolean;
}

export class CreateSurveyDto {
  @ApiProperty({ description: '제목' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: '카테고리' })
  @IsNotEmpty()
  @IsObject()
  category: SurveyCategory;

  @ApiProperty({ description: '관리자 ID' })
  @IsNotEmpty()
  @IsString()
  managerId: string;

  @ApiProperty({ description: '설명' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: '질문 목록', type: [CreateInqueryDto] })
  @IsArray()
  inqueries: CreateInqueryDto[];
}

export class UpdateSurveyDto {
  @ApiPropertyOptional({ description: '제목' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: '카테고리' })
  @IsOptional()
  @IsObject()
  category?: SurveyCategory;

  @ApiPropertyOptional({ description: '설명' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateSurveyCategoryDto {
  @ApiProperty({ description: '카테고리명' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: '설명' })
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class SubmitSurveyResponseDto {
  @ApiProperty({ description: '설문 ID' })
  @IsNotEmpty()
  @IsString()
  surveyId: string;

  @ApiProperty({ description: '직원 ID' })
  @IsNotEmpty()
  @IsString()
  employeeId: string;

  @ApiProperty({ description: '응답 데이터' })
  @IsNotEmpty()
  @IsObject()
  responses: Record<string, any>;
}

export class InqueryResponseDto {
  @ApiProperty({ description: '질문 ID' })
  id: string;

  @ApiProperty({ description: '질문 제목' })
  title: string;

  @ApiProperty({ description: '질문 타입' })
  type: InqueryType;

  @ApiProperty({ description: '질문 폼 데이터' })
  form: any;

  @ApiProperty({ description: '필수 여부' })
  isRequired: boolean;

  @ApiProperty({ description: '응답 수' })
  responseCount: number;
}

export class SurveyResponseDto {
  @ApiProperty({ description: 'ID' })
  id: string;

  @ApiProperty({ description: '제목' })
  title: string;

  @ApiProperty({ description: '카테고리' })
  category: SurveyCategory;

  @ApiProperty({ description: '관리자 정보' })
  manager: { id: string; name: string; email: string };

  @ApiProperty({ description: '설명' })
  description: string;

  @ApiProperty({ description: '질문 목록', type: [InqueryResponseDto] })
  inqueries: InqueryResponseDto[];

  @ApiProperty({ description: '상태' })
  status: SurveyStatus;

  @ApiProperty({ description: '생성 일시' })
  createdAt: Date;

  @ApiProperty({ description: '수정 일시' })
  updatedAt: Date;
}

export class SurveyCategoryResponseDto {
  @ApiProperty({ description: 'ID' })
  id: string;

  @ApiProperty({ description: '카테고리명' })
  name: string;

  @ApiProperty({ description: '설명' })
  description: string;
}

export class SurveySubmissionResponseDto {
  @ApiProperty({ description: '제출 ID' })
  id: string;

  @ApiProperty({ description: '설문 ID' })
  surveyId: string;

  @ApiProperty({ description: '직원 ID' })
  employeeId: string;

  @ApiProperty({ description: '응답 데이터' })
  responses: Record<string, any>;

  @ApiProperty({ description: '제출 일시' })
  submittedAt: Date;
}
