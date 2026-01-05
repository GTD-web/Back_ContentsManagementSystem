import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { Get, Post, Put, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import {
  CreateNewsDto,
  UpdateNewsDto,
  NewsResponseDto,
  CreateNewsCategoryDto,
  NewsCategoryResponseDto,
  CreateNewsLanguageDto,
  NewsLanguageResponseDto,
  CreateNewsTranslationDto,
  UpdateNewsTranslationDto,
  NewsTranslationResponseDto,
  CreateNewsUrlDto,
  UpdateNewsUrlDto,
  NewsUrlResponseDto,
} from '../dto/news.dto';

export function GetAllNews() {
  return applyDecorators(
    Get(),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: '뉴스 목록 조회' }),
    ApiResponse({ status: HttpStatus.OK, type: [NewsResponseDto] }),
  );
}

export function GetNews() {
  return applyDecorators(
    Get(':id'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: '뉴스 상세 조회' }),
    ApiParam({ name: 'id', description: '뉴스 ID' }),
    ApiResponse({ status: HttpStatus.OK, type: NewsResponseDto }),
  );
}

export function CreateNews() {
  return applyDecorators(
    Post(),
    HttpCode(HttpStatus.CREATED),
    ApiOperation({ summary: '뉴스 생성' }),
    ApiBody({ type: CreateNewsDto }),
    ApiResponse({ status: HttpStatus.CREATED, type: NewsResponseDto }),
  );
}

export function UpdateNews() {
  return applyDecorators(
    Put(':id'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: '뉴스 수정' }),
    ApiParam({ name: 'id', description: '뉴스 ID' }),
    ApiBody({ type: UpdateNewsDto }),
    ApiResponse({ status: HttpStatus.OK, type: NewsResponseDto }),
  );
}

export function DeleteNews() {
  return applyDecorators(
    Delete(':id'),
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({ summary: '뉴스 삭제' }),
    ApiParam({ name: 'id', description: '뉴스 ID' }),
    ApiResponse({ status: HttpStatus.NO_CONTENT }),
  );
}

export function GetAllNewsCategories() {
  return applyDecorators(
    Get('categories'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: '뉴스 카테고리 목록 조회' }),
    ApiResponse({ status: HttpStatus.OK, type: [NewsCategoryResponseDto] }),
  );
}

export function CreateNewsCategory() {
  return applyDecorators(
    Post('categories'),
    HttpCode(HttpStatus.CREATED),
    ApiOperation({ summary: '뉴스 카테고리 생성' }),
    ApiBody({ type: CreateNewsCategoryDto }),
    ApiResponse({ status: HttpStatus.CREATED, type: NewsCategoryResponseDto }),
  );
}

export function GetAllNewsLanguages() {
  return applyDecorators(
    Get('languages'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: '언어 목록 조회' }),
    ApiResponse({ status: HttpStatus.OK, type: [NewsLanguageResponseDto] }),
  );
}

export function CreateNewsLanguage() {
  return applyDecorators(
    Post('languages'),
    HttpCode(HttpStatus.CREATED),
    ApiOperation({ summary: '언어 생성' }),
    ApiBody({ type: CreateNewsLanguageDto }),
    ApiResponse({ status: HttpStatus.CREATED, type: NewsLanguageResponseDto }),
  );
}

export function GetNewsTranslations() {
  return applyDecorators(
    Get(':documentId/translations'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: '뉴스 번역 목록 조회' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiResponse({ status: HttpStatus.OK, type: [NewsTranslationResponseDto] }),
  );
}

export function GetNewsTranslation() {
  return applyDecorators(
    Get(':documentId/translations/:languageId'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: '뉴스 번역 조회' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiResponse({ status: HttpStatus.OK, type: NewsTranslationResponseDto }),
  );
}

export function CreateNewsTranslation() {
  return applyDecorators(
    Post('translations'),
    HttpCode(HttpStatus.CREATED),
    ApiOperation({ summary: '뉴스 번역 생성' }),
    ApiBody({ type: CreateNewsTranslationDto }),
    ApiResponse({
      status: HttpStatus.CREATED,
      type: NewsTranslationResponseDto,
    }),
  );
}

export function UpdateNewsTranslation() {
  return applyDecorators(
    Put(':documentId/translations/:languageId'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: '뉴스 번역 수정' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiBody({ type: UpdateNewsTranslationDto }),
    ApiResponse({ status: HttpStatus.OK, type: NewsTranslationResponseDto }),
  );
}

export function GetNewsUrl() {
  return applyDecorators(
    Get(':documentId/url'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: '뉴스 URL 조회' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiResponse({ status: HttpStatus.OK, type: NewsUrlResponseDto }),
  );
}

export function CreateNewsUrl() {
  return applyDecorators(
    Post('urls'),
    HttpCode(HttpStatus.CREATED),
    ApiOperation({ summary: '뉴스 URL 생성' }),
    ApiBody({ type: CreateNewsUrlDto }),
    ApiResponse({ status: HttpStatus.CREATED, type: NewsUrlResponseDto }),
  );
}

export function UpdateNewsUrl() {
  return applyDecorators(
    Put(':documentId/url'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: '뉴스 URL 수정' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiBody({ type: UpdateNewsUrlDto }),
    ApiResponse({ status: HttpStatus.OK, type: NewsUrlResponseDto }),
  );
}
