import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsObject,
} from 'class-validator';
import type { NewsCategory, NewsStatus } from '@domain/core/common/types';

/**
 * 뉴스 생성 DTO
 */
export class CreateNewsDto {
  @ApiProperty({ description: '제목', example: '루미르 신제품 출시 소식' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: '공개 여부',
    example: true,
    default: false,
  })
  @IsBoolean()
  isPublic: boolean;

  @ApiProperty({
    description: '카테고리',
    example: { id: '1', name: '제품 뉴스', description: '제품 관련 뉴스' },
  })
  @IsNotEmpty()
  @IsObject()
  category: NewsCategory;

  @ApiProperty({ description: '관리자 ID', example: 'emp-001' })
  @IsNotEmpty()
  @IsString()
  managerId: string;
}

/**
 * 뉴스 수정 DTO
 */
export class UpdateNewsDto {
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
  category?: NewsCategory;
}

/**
 * 카테고리 생성 DTO
 */
export class CreateNewsCategoryDto {
  @ApiProperty({ description: '카테고리명', example: '제품 뉴스' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: '설명', example: '신제품 및 업데이트 소식' })
  @IsNotEmpty()
  @IsString()
  description: string;
}

/**
 * 카테고리 수정 DTO
 */
export class UpdateNewsCategoryDto {
  @ApiPropertyOptional({ description: '카테고리명' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '설명' })
  @IsOptional()
  @IsString()
  description?: string;
}

/**
 * 언어 생성 DTO
 */
export class CreateNewsLanguageDto {
  @ApiProperty({ description: '언어 코드', example: 'ko' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ description: '언어명', example: '한국어' })
  @IsNotEmpty()
  @IsString()
  name: string;
}

/**
 * 언어 수정 DTO
 */
export class UpdateNewsLanguageDto {
  @ApiPropertyOptional({ description: '언어 코드' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: '언어명' })
  @IsOptional()
  @IsString()
  name?: string;
}

/**
 * 번역 생성 DTO
 */
export class CreateNewsTranslationDto {
  @ApiProperty({ description: '문서 ID', example: 'news-001' })
  @IsNotEmpty()
  @IsString()
  documentId: string;

  @ApiProperty({ description: '언어 ID', example: 'lang-001' })
  @IsNotEmpty()
  @IsString()
  languageId: string;

  @ApiProperty({ description: '제목', example: '루미르 신제품 출시' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: '내용',
    example: '새로운 기능을 탑재한 신제품...',
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}

/**
 * 번역 수정 DTO
 */
export class UpdateNewsTranslationDto {
  @ApiPropertyOptional({ description: '제목' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: '내용' })
  @IsOptional()
  @IsString()
  content?: string;
}

/**
 * URL 생성 DTO
 */
export class CreateNewsUrlDto {
  @ApiProperty({ description: '문서 ID', example: 'news-001' })
  @IsNotEmpty()
  @IsString()
  documentId: string;

  @ApiProperty({
    description: 'URL',
    example: 'https://example.com/news/article',
  })
  @IsNotEmpty()
  @IsString()
  url: string;
}

/**
 * URL 수정 DTO
 */
export class UpdateNewsUrlDto {
  @ApiPropertyOptional({ description: 'URL' })
  @IsOptional()
  @IsString()
  url?: string;
}

/**
 * 뉴스 응답 DTO
 */
export class NewsResponseDto {
  @ApiProperty({ description: '뉴스 ID' })
  id: string;

  @ApiProperty({ description: '제목' })
  title: string;

  @ApiProperty({ description: '공개 여부' })
  isPublic: boolean;

  @ApiProperty({ description: '상태' })
  status: NewsStatus;

  @ApiProperty({ description: '카테고리' })
  category: NewsCategory;

  @ApiProperty({ description: '관리자 정보' })
  manager: {
    id: string;
    name: string;
    email: string;
  };

  @ApiProperty({ description: '생성 일시' })
  createdAt: Date;

  @ApiProperty({ description: '수정 일시' })
  updatedAt: Date;
}

/**
 * 카테고리 응답 DTO
 */
export class NewsCategoryResponseDto {
  @ApiProperty({ description: '카테고리 ID' })
  id: string;

  @ApiProperty({ description: '카테고리명' })
  name: string;

  @ApiProperty({ description: '설명' })
  description: string;

  @ApiProperty({ description: '생성 일시' })
  createdAt: Date;
}

/**
 * 언어 응답 DTO
 */
export class NewsLanguageResponseDto {
  @ApiProperty({ description: '언어 ID' })
  id: string;

  @ApiProperty({ description: '언어 코드' })
  code: string;

  @ApiProperty({ description: '언어명' })
  name: string;
}

/**
 * 번역 응답 DTO
 */
export class NewsTranslationResponseDto {
  @ApiProperty({ description: '번역 ID' })
  id: string;

  @ApiProperty({ description: '문서 ID' })
  documentId: string;

  @ApiProperty({ description: '언어 정보' })
  language: NewsLanguageResponseDto;

  @ApiProperty({ description: '제목' })
  title: string;

  @ApiProperty({ description: '내용' })
  content: string;

  @ApiProperty({ description: '생성 일시' })
  createdAt: Date;
}

/**
 * URL 응답 DTO
 */
export class NewsUrlResponseDto {
  @ApiProperty({ description: 'URL ID' })
  id: string;

  @ApiProperty({ description: '문서 ID' })
  documentId: string;

  @ApiProperty({ description: 'URL' })
  url: string;

  @ApiProperty({ description: '생성 일시' })
  createdAt: Date;
}
