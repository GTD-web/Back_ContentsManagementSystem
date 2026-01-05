import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsObject } from 'class-validator';
import type { IRCategory, IRStatus } from '@domain/core/common/types';

export class CreateIrDto {
  @ApiProperty({ description: '제목' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: '공개 여부', default: false })
  @IsBoolean()
  isPublic: boolean;

  @ApiProperty({ description: '카테고리' })
  @IsNotEmpty()
  @IsObject()
  category: IRCategory;

  @ApiProperty({ description: '관리자 ID' })
  @IsNotEmpty()
  @IsString()
  managerId: string;
}

export class UpdateIrDto {
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
  category?: IRCategory;
}

export class CreateIrCategoryDto {
  @ApiProperty({ description: '카테고리명' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: '설명' })
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class CreateIrLanguageDto {
  @ApiProperty({ description: '언어 코드' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ description: '언어명' })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class CreateIrTranslationDto {
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

export class UpdateIrTranslationDto {
  @ApiPropertyOptional({ description: '제목' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: '내용' })
  @IsOptional()
  @IsString()
  content?: string;
}

export class IrResponseDto {
  @ApiProperty({ description: 'ID' })
  id: string;

  @ApiProperty({ description: '제목' })
  title: string;

  @ApiProperty({ description: '공개 여부' })
  isPublic: boolean;

  @ApiProperty({ description: '상태' })
  status: IRStatus;

  @ApiProperty({ description: '카테고리' })
  category: IRCategory;

  @ApiProperty({ description: '관리자 정보' })
  manager: { id: string; name: string; email: string };

  @ApiProperty({ description: '생성 일시' })
  createdAt: Date;

  @ApiProperty({ description: '수정 일시' })
  updatedAt: Date;
}

export class IrCategoryResponseDto {
  @ApiProperty({ description: 'ID' })
  id: string;

  @ApiProperty({ description: '카테고리명' })
  name: string;

  @ApiProperty({ description: '설명' })
  description: string;
}

export class IrLanguageResponseDto {
  @ApiProperty({ description: 'ID' })
  id: string;

  @ApiProperty({ description: '언어 코드' })
  code: string;

  @ApiProperty({ description: '언어명' })
  name: string;
}

export class IrTranslationResponseDto {
  @ApiProperty({ description: 'ID' })
  id: string;

  @ApiProperty({ description: '문서 ID' })
  documentId: string;

  @ApiProperty({ description: '언어 정보' })
  language: IrLanguageResponseDto;

  @ApiProperty({ description: '제목' })
  title: string;

  @ApiProperty({ description: '내용' })
  content: string;

  @ApiProperty({ description: '생성 일시' })
  createdAt: Date;
}
