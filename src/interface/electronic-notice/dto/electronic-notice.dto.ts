import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsDate,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

// ========== 전자공시 문서 DTO ==========
export class ElectronicNoticeDto {
  @ApiProperty({ description: '전자공시 ID' })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({ description: '제목' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: '공개 여부' })
  @IsBoolean()
  isPublic!: boolean;

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

export class CreateElectronicNoticeDto {
  @ApiProperty({ description: '제목' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: '공개 여부' })
  @IsBoolean()
  isPublic!: boolean;

  @ApiPropertyOptional({ description: '카테고리 ID' })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ description: '언어 ID' })
  @IsString()
  @IsOptional()
  languageId?: string;
}

export class UpdateElectronicNoticeDto {
  @ApiPropertyOptional({ description: '제목' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: '공개 여부' })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiPropertyOptional({ description: '카테고리 ID' })
  @IsString()
  @IsOptional()
  categoryId?: string;
}

// ========== 카테고리 DTO ==========
export class ElectronicNoticeCategoryDto {
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

export class CreateElectronicNoticeCategoryDto {
  @ApiProperty({ description: '카테고리 이름' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ description: '카테고리 설명' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateElectronicNoticeCategoryDto {
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
export class ElectronicNoticeTranslationDto {
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

export class CreateElectronicNoticeTranslationDto {
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

export class UpdateElectronicNoticeTranslationDto {
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
export class ElectronicNoticeAttachmentDto {
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
}

export class CreateElectronicNoticeAttachmentDto {
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
}

export class UpdateElectronicNoticeAttachmentDto {
  @ApiPropertyOptional({ description: '파일명' })
  @IsString()
  @IsOptional()
  fileName?: string;

  @ApiPropertyOptional({ description: '파일 URL' })
  @IsString()
  @IsOptional()
  fileUrl?: string;
}
