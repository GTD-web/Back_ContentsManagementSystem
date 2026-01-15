import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsDateString,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SurveyQuestionDto } from './create-survey.dto';

/**
 * 설문조사 수정 DTO
 */
export class UpdateSurveyDto {
  @ApiProperty({
    description: '설문조사 제목',
    example: '2024년 직원 만족도 조사',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

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
  })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({
    description: '설문 질문 목록 (전체 교체)',
    type: [SurveyQuestionDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SurveyQuestionDto)
  questions?: SurveyQuestionDto[];
}
