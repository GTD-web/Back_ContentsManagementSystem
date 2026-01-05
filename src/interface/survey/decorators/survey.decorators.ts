import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { Get, Post, Put, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateSurveyDto, UpdateSurveyDto, SurveyResponseDto, CreateSurveyCategoryDto, SurveyCategoryResponseDto, SubmitSurveyResponseDto, SurveySubmissionResponseDto } from '../dto/survey.dto';

export function GetAllSurveys() {
  return applyDecorators(Get(), HttpCode(HttpStatus.OK), ApiOperation({ summary: '설문조사 목록 조회' }), ApiResponse({ status: HttpStatus.OK, type: [SurveyResponseDto] }));
}

export function GetSurvey() {
  return applyDecorators(Get(':id'), HttpCode(HttpStatus.OK), ApiOperation({ summary: '설문조사 상세 조회' }), ApiParam({ name: 'id' }), ApiResponse({ status: HttpStatus.OK, type: SurveyResponseDto }));
}

export function CreateSurvey() {
  return applyDecorators(Post(), HttpCode(HttpStatus.CREATED), ApiOperation({ summary: '설문조사 생성' }), ApiBody({ type: CreateSurveyDto }), ApiResponse({ status: HttpStatus.CREATED, type: SurveyResponseDto }));
}

export function UpdateSurvey() {
  return applyDecorators(Put(':id'), HttpCode(HttpStatus.OK), ApiOperation({ summary: '설문조사 수정' }), ApiParam({ name: 'id' }), ApiBody({ type: UpdateSurveyDto }), ApiResponse({ status: HttpStatus.OK, type: SurveyResponseDto }));
}

export function DeleteSurvey() {
  return applyDecorators(Delete(':id'), HttpCode(HttpStatus.NO_CONTENT), ApiOperation({ summary: '설문조사 삭제' }), ApiParam({ name: 'id' }), ApiResponse({ status: HttpStatus.NO_CONTENT }));
}

export function GetAllSurveyCategories() {
  return applyDecorators(Get('categories'), HttpCode(HttpStatus.OK), ApiOperation({ summary: '설문조사 카테고리 목록 조회' }), ApiResponse({ status: HttpStatus.OK, type: [SurveyCategoryResponseDto] }));
}

export function CreateSurveyCategory() {
  return applyDecorators(Post('categories'), HttpCode(HttpStatus.CREATED), ApiOperation({ summary: '설문조사 카테고리 생성' }), ApiBody({ type: CreateSurveyCategoryDto }), ApiResponse({ status: HttpStatus.CREATED, type: SurveyCategoryResponseDto }));
}

export function SubmitSurveyResponse() {
  return applyDecorators(Post(':id/submit'), HttpCode(HttpStatus.CREATED), ApiOperation({ summary: '설문조사 응답 제출' }), ApiParam({ name: 'id', description: '설문조사 ID' }), ApiBody({ type: SubmitSurveyResponseDto }), ApiResponse({ status: HttpStatus.CREATED, type: SurveySubmissionResponseDto }));
}

export function GetSurveyResults() {
  return applyDecorators(Get(':id/results'), HttpCode(HttpStatus.OK), ApiOperation({ summary: '설문조사 결과 조회' }), ApiParam({ name: 'id' }), ApiResponse({ status: HttpStatus.OK, type: [SurveySubmissionResponseDto] }));
}
