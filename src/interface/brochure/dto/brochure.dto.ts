import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsObject,
} from 'class-validator';
import type {
  BrochureCategory,
  BrochureStatus,
} from '@domain/core/common/types';

export class CreateBrochureDto {
  @ApiProperty({ description: '제목', example: '회사 소개 브로슈어' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: '공개 여부', default: false })
  @IsBoolean()
  isPublic: boolean;

  @ApiProperty({ description: '카테고리' })
  @IsNotEmpty()
  @IsObject()
  category: BrochureCategory;

  @ApiProperty({ description: '관리자 ID' })
  @IsNotEmpty()
  @IsString()
  managerId: string;
}

export class UpdateBrochureDto {
  @ApiPropertyOptional({ description: '제목' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: '공개 여부' })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({ description: '카테고리' })
  @IsOptional()
  @IsObject()
  category?: BrochureCategory;
}

export class CreateBrochureCategoryDto {
  @ApiProperty({ description: '카테고리명' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: '설명' })
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class UpdateBrochureCategoryDto {
  @ApiPropertyOptional({ description: '카테고리명' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '설명' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateBrochureLanguageDto {
  @ApiProperty({ description: '언어 코드' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ description: '언어명' })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class CreateBrochureTranslationDto {
  @ApiProperty({ description: '문서 ID' })
  @IsNotEmpty()
  @IsString()
  documentId: string;

  @ApiProperty({ description: '언어 ID' })
  @IsNotEmpty()
  @IsString()
  languageId: string;

  @ApiProperty({ description: '제목' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: '내용' })
  @IsNotEmpty()
  @IsString()
  content: string;
}

export class UpdateBrochureTranslationDto {
  @ApiPropertyOptional({ description: '제목' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: '내용' })
  @IsOptional()
  @IsString()
  content?: string;
}

export class BrochureResponseDto {
  @ApiProperty({ description: 'ID' })
  id: string;

  @ApiProperty({ description: '제목' })
  title: string;

  @ApiProperty({ description: '공개 여부' })
  isPublic: boolean;

  @ApiProperty({ description: '상태' })
  status: BrochureStatus;

  @ApiProperty({ description: '카테고리' })
  category: BrochureCategory;

  @ApiProperty({ description: '관리자 정보' })
  manager: { id: string; name: string; email: string };

  @ApiProperty({ description: '생성 일시' })
  createdAt: Date;

  @ApiProperty({ description: '수정 일시' })
  updatedAt: Date;
}

export class BrochureCategoryResponseDto {
  @ApiProperty({ description: 'ID' })
  id: string;

  @ApiProperty({ description: '카테고리명' })
  name: string;

  @ApiProperty({ description: '설명' })
  description: string;

  @ApiProperty({ description: '생성 일시' })
  createdAt: Date;
}

export class BrochureLanguageResponseDto {
  @ApiProperty({ description: 'ID' })
  id: string;

  @ApiProperty({ description: '언어 코드' })
  code: string;

  @ApiProperty({ description: '언어명' })
  name: string;
}

export class BrochureTranslationResponseDto {
  @ApiProperty({ description: 'ID' })
  id: string;

  @ApiProperty({ description: '문서 ID' })
  documentId: string;

  @ApiProperty({ description: '언어 정보' })
  language: BrochureLanguageResponseDto;

  @ApiProperty({ description: '제목' })
  title: string;

  @ApiProperty({ description: '내용' })
  content: string;

  @ApiProperty({ description: '생성 일시' })
  createdAt: Date;
}
