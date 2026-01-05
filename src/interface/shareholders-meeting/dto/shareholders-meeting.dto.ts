import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsDate,
  IsObject,
  IsArray,
  ValidateNested,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

// ========== 의결 결과 DTO ==========
export class ResultOfVoteDto {
  @ApiProperty({ description: '안건 제목' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: '총 투표수' })
  @IsNumber()
  totalVote!: number;

  @ApiProperty({ description: '찬성 투표수' })
  @IsNumber()
  yesVote!: number;

  @ApiProperty({ description: '반대 투표수' })
  @IsNumber()
  noVote!: number;

  @ApiProperty({ description: '찬성률' })
  @IsNumber()
  approvalRating!: number;

  @ApiProperty({
    description: '의결 결과',
    enum: ['accepted', 'rejected'],
  })
  @IsEnum(['accepted', 'rejected'])
  result!: 'accepted' | 'rejected';
}

// ========== 주주총회 문서 DTO ==========
export class ShareholdersMeetingDto {
  @ApiProperty({ description: '주주총회 ID' })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({ description: '제목' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: '결과 텍스트' })
  @IsString()
  resultText!: string;

  @ApiProperty({ description: '요약' })
  @IsString()
  summary!: string;

  @ApiProperty({ description: '장소' })
  @IsString()
  location!: string;

  @ApiProperty({ description: '회의 날짜' })
  @IsDate()
  @Type(() => Date)
  meetingDate!: Date;

  @ApiProperty({ description: '의결 결과', type: ResultOfVoteDto })
  @IsObject()
  @ValidateNested()
  @Type(() => ResultOfVoteDto)
  resultOfVote!: ResultOfVoteDto;

  @ApiProperty({ description: '공개 여부' })
  @IsBoolean()
  isPublic!: boolean;

  @ApiPropertyOptional({ description: '공개 일시' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  releasedAt?: Date;

  @ApiPropertyOptional({ description: '카테고리' })
  @IsOptional()
  category?: any;

  @ApiPropertyOptional({ description: '언어' })
  @IsOptional()
  language?: any;

  @ApiPropertyOptional({ description: '관리자' })
  @IsOptional()
  manager?: any;

  @ApiPropertyOptional({ description: '첨부파일 목록', type: [String] })
  @IsArray()
  @IsOptional()
  attachments?: string[];

  @ApiPropertyOptional({ description: '태그 목록', type: [String] })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: '생성일' })
  @IsDate()
  @Type(() => Date)
  createdAt!: Date;

  @ApiProperty({ description: '수정일' })
  @IsDate()
  @Type(() => Date)
  updatedAt!: Date;
}

export class CreateShareholdersMeetingDto {
  @ApiProperty({ description: '제목' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: '결과 텍스트' })
  @IsString()
  @IsNotEmpty()
  resultText!: string;

  @ApiProperty({ description: '요약' })
  @IsString()
  @IsNotEmpty()
  summary!: string;

  @ApiProperty({ description: '장소' })
  @IsString()
  @IsNotEmpty()
  location!: string;

  @ApiProperty({ description: '회의 날짜' })
  @IsDate()
  @Type(() => Date)
  meetingDate!: Date;

  @ApiProperty({ description: '의결 결과', type: ResultOfVoteDto })
  @IsObject()
  @ValidateNested()
  @Type(() => ResultOfVoteDto)
  resultOfVote!: ResultOfVoteDto;

  @ApiProperty({ description: '공개 여부' })
  @IsBoolean()
  isPublic!: boolean;

  @ApiPropertyOptional({ description: '공개 일시' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  releasedAt?: Date;

  @ApiPropertyOptional({ description: '카테고리 ID' })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ description: '언어 ID' })
  @IsString()
  @IsOptional()
  languageId?: string;
}

export class UpdateShareholdersMeetingDto {
  @ApiPropertyOptional({ description: '제목' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: '결과 텍스트' })
  @IsString()
  @IsOptional()
  resultText?: string;

  @ApiPropertyOptional({ description: '요약' })
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiPropertyOptional({ description: '장소' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ description: '회의 날짜' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  meetingDate?: Date;

  @ApiPropertyOptional({ description: '의결 결과', type: ResultOfVoteDto })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => ResultOfVoteDto)
  resultOfVote?: ResultOfVoteDto;

  @ApiPropertyOptional({ description: '공개 여부' })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiPropertyOptional({ description: '공개 일시' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  releasedAt?: Date;

  @ApiPropertyOptional({ description: '카테고리 ID' })
  @IsString()
  @IsOptional()
  categoryId?: string;
}

// ========== 카테고리 DTO ==========
export class ShareholdersMeetingCategoryDto {
  @ApiProperty({ description: '카테고리 ID' })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({ description: '카테고리 이름' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ description: '카테고리 설명' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateShareholdersMeetingCategoryDto {
  @ApiProperty({ description: '카테고리 이름' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ description: '카테고리 설명' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateShareholdersMeetingCategoryDto {
  @ApiPropertyOptional({ description: '카테고리 이름' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: '카테고리 설명' })
  @IsString()
  @IsOptional()
  description?: string;
}

// ========== 번역 DTO ==========
export class ShareholdersMeetingTranslationDto {
  @ApiProperty({ description: '문서 ID' })
  @IsString()
  @IsNotEmpty()
  documentId!: string;

  @ApiProperty({ description: '언어 ID' })
  @IsString()
  @IsNotEmpty()
  languageId!: string;

  @ApiProperty({ description: '번역된 제목' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: '번역된 내용' })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiPropertyOptional({ description: '첨부파일 목록' })
  @IsArray()
  @IsOptional()
  attachments?: any[];
}

export class CreateShareholdersMeetingTranslationDto {
  @ApiProperty({ description: '문서 ID' })
  @IsString()
  @IsNotEmpty()
  documentId!: string;

  @ApiProperty({ description: '언어 ID' })
  @IsString()
  @IsNotEmpty()
  languageId!: string;

  @ApiProperty({ description: '번역된 제목' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: '번역된 내용' })
  @IsString()
  @IsNotEmpty()
  content!: string;
}

export class UpdateShareholdersMeetingTranslationDto {
  @ApiPropertyOptional({ description: '번역된 제목' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: '번역된 내용' })
  @IsString()
  @IsOptional()
  content?: string;
}

// ========== 첨부파일 DTO ==========
export class ShareholdersMeetingAttachmentDto {
  @ApiProperty({ description: '첨부파일 ID' })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({ description: '문서 ID' })
  @IsString()
  @IsNotEmpty()
  documentId!: string;

  @ApiProperty({ description: '언어 ID' })
  @IsString()
  @IsNotEmpty()
  languageId!: string;

  @ApiProperty({ description: '파일명' })
  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @ApiProperty({ description: '파일 URL' })
  @IsString()
  @IsNotEmpty()
  fileUrl!: string;

  @ApiPropertyOptional({ description: '파일 크기' })
  @IsNumber()
  @IsOptional()
  fileSize?: number;
}

export class CreateShareholdersMeetingAttachmentDto {
  @ApiProperty({ description: '문서 ID' })
  @IsString()
  @IsNotEmpty()
  documentId!: string;

  @ApiProperty({ description: '언어 ID' })
  @IsString()
  @IsNotEmpty()
  languageId!: string;

  @ApiProperty({ description: '파일명' })
  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @ApiProperty({ description: '파일 URL' })
  @IsString()
  @IsNotEmpty()
  fileUrl!: string;

  @ApiPropertyOptional({ description: '파일 크기' })
  @IsNumber()
  @IsOptional()
  fileSize?: number;
}

export class UpdateShareholdersMeetingAttachmentDto {
  @ApiPropertyOptional({ description: '파일명' })
  @IsString()
  @IsOptional()
  fileName?: string;

  @ApiPropertyOptional({ description: '파일 URL' })
  @IsString()
  @IsOptional()
  fileUrl?: string;

  @ApiPropertyOptional({ description: '파일 크기' })
  @IsNumber()
  @IsOptional()
  fileSize?: number;
}

// ========== 주주총회 상세 정보 DTO ==========
export class ShareholdersMeetingDetailDto {
  @ApiProperty({ description: '문서 ID' })
  @IsString()
  @IsNotEmpty()
  documentId!: string;

  @ApiProperty({ description: '언어 ID' })
  @IsString()
  @IsNotEmpty()
  languageId!: string;

  @ApiProperty({ description: '상세 내용' })
  @IsString()
  @IsNotEmpty()
  detailContent!: string;

  @ApiPropertyOptional({ description: '추가 정보' })
  @IsObject()
  @IsOptional()
  additionalInfo?: any;
}

export class CreateShareholdersMeetingDetailDto {
  @ApiProperty({ description: '문서 ID' })
  @IsString()
  @IsNotEmpty()
  documentId!: string;

  @ApiProperty({ description: '언어 ID' })
  @IsString()
  @IsNotEmpty()
  languageId!: string;

  @ApiProperty({ description: '상세 내용' })
  @IsString()
  @IsNotEmpty()
  detailContent!: string;

  @ApiPropertyOptional({ description: '추가 정보' })
  @IsObject()
  @IsOptional()
  additionalInfo?: any;
}

export class UpdateShareholdersMeetingDetailDto {
  @ApiPropertyOptional({ description: '상세 내용' })
  @IsString()
  @IsOptional()
  detailContent?: string;

  @ApiPropertyOptional({ description: '추가 정보' })
  @IsObject()
  @IsOptional()
  additionalInfo?: any;
}

// ========== 안건 항목 DTO ==========
export class AgendaItemDto {
  @ApiProperty({ description: '안건 항목 ID' })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({ description: '문서 ID' })
  @IsString()
  @IsNotEmpty()
  documentId!: string;

  @ApiProperty({ description: '언어 ID' })
  @IsString()
  @IsNotEmpty()
  languageId!: string;

  @ApiProperty({ description: '안건 제목' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: '안건 내용' })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiPropertyOptional({ description: '순서' })
  @IsNumber()
  @IsOptional()
  order?: number;
}

export class CreateAgendaItemDto {
  @ApiProperty({ description: '문서 ID' })
  @IsString()
  @IsNotEmpty()
  documentId!: string;

  @ApiProperty({ description: '언어 ID' })
  @IsString()
  @IsNotEmpty()
  languageId!: string;

  @ApiProperty({ description: '안건 제목' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: '안건 내용' })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiPropertyOptional({ description: '순서' })
  @IsNumber()
  @IsOptional()
  order?: number;
}

export class UpdateAgendaItemDto {
  @ApiPropertyOptional({ description: '안건 제목' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: '안건 내용' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: '순서' })
  @IsNumber()
  @IsOptional()
  order?: number;
}
