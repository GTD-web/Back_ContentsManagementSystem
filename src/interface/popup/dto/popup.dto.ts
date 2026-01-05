import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsDate, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

// ========== 팝업 문서 DTO ==========
export class PopupDto {
  @ApiProperty({ description: '팝업 ID' })
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

  @ApiPropertyOptional({ description: '관리자' })
  @IsOptional()
  manager?: any;

  @ApiProperty({ description: '생성일' })
  @IsDate()
  @Type(() => Date)
  createdAt!: Date;

  @ApiProperty({ description: '수정일' })
  @IsDate()
  @Type(() => Date)
  updatedAt!: Date;
}

export class CreatePopupDto {
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
}

export class UpdatePopupDto {
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
export class PopupCategoryDto {
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

export class CreatePopupCategoryDto {
  @ApiProperty({ description: '카테고리 이름' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ description: '카테고리 설명' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdatePopupCategoryDto {
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
export class PopupTranslationDto {
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

export class CreatePopupTranslationDto {
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

export class UpdatePopupTranslationDto {
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
export class PopupAttachmentDto {
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

export class CreatePopupAttachmentDto {
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

export class UpdatePopupAttachmentDto {
  @ApiPropertyOptional({ description: '파일명' })
  @IsString()
  @IsOptional()
  fileName?: string;

  @ApiPropertyOptional({ description: '파일 URL' })
  @IsString()
  @IsOptional()
  fileUrl?: string;
}
