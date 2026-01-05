import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

// ========== 주주총회 문서 CRUD 데코레이터 ==========
export function GetAllShareholdersMeetings() {
  return applyDecorators(
    ApiOperation({ summary: '주주총회 목록 조회' }),
    ApiQuery({ name: 'code', required: false, description: 'CMS 문서 타입 코드' }),
    ApiResponse({
      status: 200,
      description: '주주총회 목록 조회 성공',
    }),
  );
}

export function GetShareholdersMeeting() {
  return applyDecorators(
    ApiOperation({ summary: '주주총회 상세 조회' }),
    ApiParam({ name: 'id', description: '주주총회 ID' }),
    ApiResponse({
      status: 200,
      description: '주주총회 상세 조회 성공',
    }),
    ApiResponse({ status: 404, description: '주주총회를 찾을 수 없습니다' }),
  );
}

export function CreateShareholdersMeeting() {
  return applyDecorators(
    ApiOperation({ summary: '주주총회 생성' }),
    ApiBody({ type: 'CreateShareholdersMeetingDto' as any }),
    ApiResponse({
      status: 201,
      description: '주주총회 생성 성공',
    }),
    ApiResponse({ status: 400, description: '잘못된 요청입니다' }),
  );
}

export function UpdateShareholdersMeeting() {
  return applyDecorators(
    ApiOperation({ summary: '주주총회 수정' }),
    ApiParam({ name: 'id', description: '주주총회 ID' }),
    ApiBody({ type: 'UpdateShareholdersMeetingDto' as any }),
    ApiResponse({
      status: 200,
      description: '주주총회 수정 성공',
    }),
    ApiResponse({ status: 404, description: '주주총회를 찾을 수 없습니다' }),
  );
}

export function DeleteShareholdersMeeting() {
  return applyDecorators(
    ApiOperation({ summary: '주주총회 삭제' }),
    ApiParam({ name: 'id', description: '주주총회 ID' }),
    ApiResponse({ status: 200, description: '주주총회 삭제 성공' }),
    ApiResponse({ status: 404, description: '주주총회를 찾을 수 없습니다' }),
  );
}

// ========== 카테고리 CRUD 데코레이터 ==========
export function GetAllShareholdersMeetingCategories() {
  return applyDecorators(
    ApiOperation({ summary: '주주총회 카테고리 목록 조회' }),
    ApiQuery({ name: 'code', required: false, description: 'CMS 문서 타입 코드' }),
    ApiResponse({
      status: 200,
      description: '카테고리 목록 조회 성공',
    }),
  );
}

export function CreateShareholdersMeetingCategory() {
  return applyDecorators(
    ApiOperation({ summary: '주주총회 카테고리 생성' }),
    ApiBody({ type: 'CreateShareholdersMeetingCategoryDto' as any }),
    ApiResponse({
      status: 201,
      description: '카테고리 생성 성공',
    }),
  );
}

export function UpdateShareholdersMeetingCategory() {
  return applyDecorators(
    ApiOperation({ summary: '주주총회 카테고리 수정' }),
    ApiParam({ name: 'id', description: '카테고리 ID' }),
    ApiBody({ type: 'UpdateShareholdersMeetingCategoryDto' as any }),
    ApiResponse({
      status: 200,
      description: '카테고리 수정 성공',
    }),
  );
}

export function DeleteShareholdersMeetingCategory() {
  return applyDecorators(
    ApiOperation({ summary: '주주총회 카테고리 삭제' }),
    ApiParam({ name: 'id', description: '카테고리 ID' }),
    ApiResponse({ status: 200, description: '카테고리 삭제 성공' }),
  );
}

// ========== 번역 CRUD 데코레이터 ==========
export function GetShareholdersMeetingTranslations() {
  return applyDecorators(
    ApiOperation({ summary: '주주총회 번역 목록 조회' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiResponse({
      status: 200,
      description: '번역 목록 조회 성공',
    }),
  );
}

export function GetShareholdersMeetingTranslation() {
  return applyDecorators(
    ApiOperation({ summary: '주주총회 번역 조회' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiResponse({
      status: 200,
      description: '번역 조회 성공',
    }),
  );
}

export function CreateShareholdersMeetingTranslation() {
  return applyDecorators(
    ApiOperation({ summary: '주주총회 번역 생성' }),
    ApiBody({ type: 'CreateShareholdersMeetingTranslationDto' as any }),
    ApiResponse({
      status: 201,
      description: '번역 생성 성공',
    }),
  );
}

export function UpdateShareholdersMeetingTranslation() {
  return applyDecorators(
    ApiOperation({ summary: '주주총회 번역 수정' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiBody({ type: 'UpdateShareholdersMeetingTranslationDto' as any }),
    ApiResponse({
      status: 200,
      description: '번역 수정 성공',
    }),
  );
}

export function DeleteShareholdersMeetingTranslation() {
  return applyDecorators(
    ApiOperation({ summary: '주주총회 번역 삭제' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiResponse({ status: 200, description: '번역 삭제 성공' }),
  );
}

// ========== 첨부파일 CRUD 데코레이터 ==========
export function GetShareholdersMeetingAttachments() {
  return applyDecorators(
    ApiOperation({ summary: '주주총회 첨부파일 목록 조회' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiResponse({
      status: 200,
      description: '첨부파일 목록 조회 성공',
    }),
  );
}

export function GetShareholdersMeetingAttachment() {
  return applyDecorators(
    ApiOperation({ summary: '주주총회 첨부파일 조회' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiParam({ name: 'attachmentId', description: '첨부파일 ID' }),
    ApiResponse({
      status: 200,
      description: '첨부파일 조회 성공',
    }),
  );
}

export function CreateShareholdersMeetingAttachment() {
  return applyDecorators(
    ApiOperation({ summary: '주주총회 첨부파일 생성' }),
    ApiBody({ type: 'CreateShareholdersMeetingAttachmentDto' as any }),
    ApiResponse({
      status: 201,
      description: '첨부파일 생성 성공',
    }),
  );
}

export function UpdateShareholdersMeetingAttachment() {
  return applyDecorators(
    ApiOperation({ summary: '주주총회 첨부파일 수정' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiParam({ name: 'attachmentId', description: '첨부파일 ID' }),
    ApiBody({ type: 'UpdateShareholdersMeetingAttachmentDto' as any }),
    ApiResponse({
      status: 200,
      description: '첨부파일 수정 성공',
    }),
  );
}

export function DeleteShareholdersMeetingAttachment() {
  return applyDecorators(
    ApiOperation({ summary: '주주총회 첨부파일 삭제' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiParam({ name: 'attachmentId', description: '첨부파일 ID' }),
    ApiResponse({ status: 200, description: '첨부파일 삭제 성공' }),
  );
}

// ========== 상세 정보 CRUD 데코레이터 ==========
export function GetShareholdersMeetingDetail() {
  return applyDecorators(
    ApiOperation({ summary: '주주총회 상세 정보 조회' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiResponse({
      status: 200,
      description: '상세 정보 조회 성공',
    }),
  );
}

export function CreateShareholdersMeetingDetail() {
  return applyDecorators(
    ApiOperation({ summary: '주주총회 상세 정보 생성' }),
    ApiBody({ type: 'CreateShareholdersMeetingDetailDto' as any }),
    ApiResponse({
      status: 201,
      description: '상세 정보 생성 성공',
    }),
  );
}

export function UpdateShareholdersMeetingDetail() {
  return applyDecorators(
    ApiOperation({ summary: '주주총회 상세 정보 수정' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiBody({ type: 'UpdateShareholdersMeetingDetailDto' as any }),
    ApiResponse({
      status: 200,
      description: '상세 정보 수정 성공',
    }),
  );
}

export function DeleteShareholdersMeetingDetail() {
  return applyDecorators(
    ApiOperation({ summary: '주주총회 상세 정보 삭제' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiResponse({ status: 200, description: '상세 정보 삭제 성공' }),
  );
}

// ========== 안건 항목 CRUD 데코레이터 ==========
export function GetAgendaItems() {
  return applyDecorators(
    ApiOperation({ summary: '안건 항목 목록 조회' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiResponse({
      status: 200,
      description: '안건 항목 목록 조회 성공',
    }),
  );
}

export function GetAgendaItem() {
  return applyDecorators(
    ApiOperation({ summary: '안건 항목 조회' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiParam({ name: 'agendaItemId', description: '안건 항목 ID' }),
    ApiResponse({
      status: 200,
      description: '안건 항목 조회 성공',
    }),
  );
}

export function CreateAgendaItem() {
  return applyDecorators(
    ApiOperation({ summary: '안건 항목 생성' }),
    ApiBody({ type: 'CreateAgendaItemDto' as any }),
    ApiResponse({
      status: 201,
      description: '안건 항목 생성 성공',
    }),
  );
}

export function UpdateAgendaItem() {
  return applyDecorators(
    ApiOperation({ summary: '안건 항목 수정' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiParam({ name: 'agendaItemId', description: '안건 항목 ID' }),
    ApiBody({ type: 'UpdateAgendaItemDto' as any }),
    ApiResponse({
      status: 200,
      description: '안건 항목 수정 성공',
    }),
  );
}

export function DeleteAgendaItem() {
  return applyDecorators(
    ApiOperation({ summary: '안건 항목 삭제' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiParam({ name: 'agendaItemId', description: '안건 항목 ID' }),
    ApiResponse({ status: 200, description: '안건 항목 삭제 성공' }),
  );
}
