import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { Get, Post, Put, Delete } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import {
  CreateBrochureDto,
  UpdateBrochureDto,
  BrochureResponseDto,
  CreateBrochureCategoryDto,
  BrochureCategoryResponseDto,
  CreateBrochureLanguageDto,
  BrochureLanguageResponseDto,
  CreateBrochureTranslationDto,
  UpdateBrochureTranslationDto,
  BrochureTranslationResponseDto,
} from '../dto/brochure.dto';

export function GetAllBrochures() {
  return applyDecorators(
    Get(),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: '브로슈어 목록 조회' }),
    ApiResponse({ status: HttpStatus.OK, type: [BrochureResponseDto] }),
  );
}

export function GetBrochure() {
  return applyDecorators(
    Get(':id'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: '브로슈어 상세 조회' }),
    ApiParam({ name: 'id', description: '브로슈어 ID' }),
    ApiResponse({ status: HttpStatus.OK, type: BrochureResponseDto }),
  );
}

export function CreateBrochure() {
  return applyDecorators(
    Post(),
    HttpCode(HttpStatus.CREATED),
    ApiOperation({ summary: '브로슈어 생성' }),
    ApiBody({ type: CreateBrochureDto }),
    ApiResponse({ status: HttpStatus.CREATED, type: BrochureResponseDto }),
  );
}

export function UpdateBrochure() {
  return applyDecorators(
    Put(':id'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: '브로슈어 수정' }),
    ApiParam({ name: 'id', description: '브로슈어 ID' }),
    ApiBody({ type: UpdateBrochureDto }),
    ApiResponse({ status: HttpStatus.OK, type: BrochureResponseDto }),
  );
}

export function DeleteBrochure() {
  return applyDecorators(
    Delete(':id'),
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({ summary: '브로슈어 삭제' }),
    ApiParam({ name: 'id', description: '브로슈어 ID' }),
    ApiResponse({ status: HttpStatus.NO_CONTENT }),
  );
}

export function GetAllBrochureCategories() {
  return applyDecorators(
    Get('categories'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: '브로슈어 카테고리 목록 조회' }),
    ApiResponse({
      status: HttpStatus.OK,
      type: [BrochureCategoryResponseDto],
    }),
  );
}

export function CreateBrochureCategory() {
  return applyDecorators(
    Post('categories'),
    HttpCode(HttpStatus.CREATED),
    ApiOperation({ summary: '브로슈어 카테고리 생성' }),
    ApiBody({ type: CreateBrochureCategoryDto }),
    ApiResponse({
      status: HttpStatus.CREATED,
      type: BrochureCategoryResponseDto,
    }),
  );
}

export function GetAllBrochureLanguages() {
  return applyDecorators(
    Get('languages'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: '언어 목록 조회' }),
    ApiResponse({
      status: HttpStatus.OK,
      type: [BrochureLanguageResponseDto],
    }),
  );
}

export function CreateBrochureLanguage() {
  return applyDecorators(
    Post('languages'),
    HttpCode(HttpStatus.CREATED),
    ApiOperation({ summary: '언어 생성' }),
    ApiBody({ type: CreateBrochureLanguageDto }),
    ApiResponse({
      status: HttpStatus.CREATED,
      type: BrochureLanguageResponseDto,
    }),
  );
}

export function GetBrochureTranslations() {
  return applyDecorators(
    Get(':documentId/translations'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: '브로슈어 번역 목록 조회' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiResponse({
      status: HttpStatus.OK,
      type: [BrochureTranslationResponseDto],
    }),
  );
}

export function GetBrochureTranslation() {
  return applyDecorators(
    Get(':documentId/translations/:languageId'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: '브로슈어 번역 조회' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiResponse({ status: HttpStatus.OK, type: BrochureTranslationResponseDto }),
  );
}

export function CreateBrochureTranslation() {
  return applyDecorators(
    Post('translations'),
    HttpCode(HttpStatus.CREATED),
    ApiOperation({ summary: '브로슈어 번역 생성' }),
    ApiBody({ type: CreateBrochureTranslationDto }),
    ApiResponse({
      status: HttpStatus.CREATED,
      type: BrochureTranslationResponseDto,
    }),
  );
}

export function UpdateBrochureTranslation() {
  return applyDecorators(
    Put(':documentId/translations/:languageId'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: '브로슈어 번역 수정' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiBody({ type: UpdateBrochureTranslationDto }),
    ApiResponse({ status: HttpStatus.OK, type: BrochureTranslationResponseDto }),
  );
}
