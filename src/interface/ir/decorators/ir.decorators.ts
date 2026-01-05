import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { Get, Post, Put, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateIrDto, UpdateIrDto, IrResponseDto, CreateIrCategoryDto, IrCategoryResponseDto, CreateIrLanguageDto, IrLanguageResponseDto, CreateIrTranslationDto, UpdateIrTranslationDto, IrTranslationResponseDto } from '../dto/ir.dto';

export function GetAllIrs() {
  return applyDecorators(Get(), HttpCode(HttpStatus.OK), ApiOperation({ summary: 'IR 목록 조회' }), ApiResponse({ status: HttpStatus.OK, type: [IrResponseDto] }));
}

export function GetIr() {
  return applyDecorators(Get(':id'), HttpCode(HttpStatus.OK), ApiOperation({ summary: 'IR 상세 조회' }), ApiParam({ name: 'id' }), ApiResponse({ status: HttpStatus.OK, type: IrResponseDto }));
}

export function CreateIr() {
  return applyDecorators(Post(), HttpCode(HttpStatus.CREATED), ApiOperation({ summary: 'IR 생성' }), ApiBody({ type: CreateIrDto }), ApiResponse({ status: HttpStatus.CREATED, type: IrResponseDto }));
}

export function UpdateIr() {
  return applyDecorators(Put(':id'), HttpCode(HttpStatus.OK), ApiOperation({ summary: 'IR 수정' }), ApiParam({ name: 'id' }), ApiBody({ type: UpdateIrDto }), ApiResponse({ status: HttpStatus.OK, type: IrResponseDto }));
}

export function DeleteIr() {
  return applyDecorators(Delete(':id'), HttpCode(HttpStatus.NO_CONTENT), ApiOperation({ summary: 'IR 삭제' }), ApiParam({ name: 'id' }), ApiResponse({ status: HttpStatus.NO_CONTENT }));
}

export function GetAllIrCategories() {
  return applyDecorators(Get('categories'), HttpCode(HttpStatus.OK), ApiOperation({ summary: 'IR 카테고리 목록 조회' }), ApiResponse({ status: HttpStatus.OK, type: [IrCategoryResponseDto] }));
}

export function CreateIrCategory() {
  return applyDecorators(Post('categories'), HttpCode(HttpStatus.CREATED), ApiOperation({ summary: 'IR 카테고리 생성' }), ApiBody({ type: CreateIrCategoryDto }), ApiResponse({ status: HttpStatus.CREATED, type: IrCategoryResponseDto }));
}

export function GetAllIrLanguages() {
  return applyDecorators(Get('languages'), HttpCode(HttpStatus.OK), ApiOperation({ summary: '언어 목록 조회' }), ApiResponse({ status: HttpStatus.OK, type: [IrLanguageResponseDto] }));
}

export function CreateIrLanguage() {
  return applyDecorators(Post('languages'), HttpCode(HttpStatus.CREATED), ApiOperation({ summary: '언어 생성' }), ApiBody({ type: CreateIrLanguageDto }), ApiResponse({ status: HttpStatus.CREATED, type: IrLanguageResponseDto }));
}

export function GetIrTranslations() {
  return applyDecorators(Get(':documentId/translations'), HttpCode(HttpStatus.OK), ApiOperation({ summary: 'IR 번역 목록 조회' }), ApiParam({ name: 'documentId' }), ApiResponse({ status: HttpStatus.OK, type: [IrTranslationResponseDto] }));
}

export function GetIrTranslation() {
  return applyDecorators(Get(':documentId/translations/:languageId'), HttpCode(HttpStatus.OK), ApiOperation({ summary: 'IR 번역 조회' }), ApiParam({ name: 'documentId' }), ApiParam({ name: 'languageId' }), ApiResponse({ status: HttpStatus.OK, type: IrTranslationResponseDto }));
}

export function CreateIrTranslation() {
  return applyDecorators(Post('translations'), HttpCode(HttpStatus.CREATED), ApiOperation({ summary: 'IR 번역 생성' }), ApiBody({ type: CreateIrTranslationDto }), ApiResponse({ status: HttpStatus.CREATED, type: IrTranslationResponseDto }));
}

export function UpdateIrTranslation() {
  return applyDecorators(Put(':documentId/translations/:languageId'), HttpCode(HttpStatus.OK), ApiOperation({ summary: 'IR 번역 수정' }), ApiParam({ name: 'documentId' }), ApiParam({ name: 'languageId' }), ApiBody({ type: UpdateIrTranslationDto }), ApiResponse({ status: HttpStatus.OK, type: IrTranslationResponseDto }));
}
