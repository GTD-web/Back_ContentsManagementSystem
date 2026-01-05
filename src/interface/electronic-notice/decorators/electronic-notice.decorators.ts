import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

// ========== 전자공시 문서 CRUD 데코레이터 ==========
export function GetAllElectronicNotices() {
  return applyDecorators(
    ApiOperation({ summary: '전자공시 목록 조회' }),
    ApiQuery({ name: 'code', required: false, description: 'CMS 문서 타입 코드' }),
    ApiResponse({ status: 200, description: '전자공시 목록 조회 성공' }),
  );
}

export function GetElectronicNotice() {
  return applyDecorators(
    ApiOperation({ summary: '전자공시 상세 조회' }),
    ApiParam({ name: 'id', description: '전자공시 ID' }),
    ApiResponse({ status: 200, description: '전자공시 상세 조회 성공' }),
  );
}

export function CreateElectronicNotice() {
  return applyDecorators(
    ApiOperation({ summary: '전자공시 생성' }),
    ApiBody({ type: 'CreateElectronicNoticeDto' as any }),
    ApiResponse({ status: 201, description: '전자공시 생성 성공' }),
  );
}

export function UpdateElectronicNotice() {
  return applyDecorators(
    ApiOperation({ summary: '전자공시 수정' }),
    ApiParam({ name: 'id', description: '전자공시 ID' }),
    ApiBody({ type: 'UpdateElectronicNoticeDto' as any }),
    ApiResponse({ status: 200, description: '전자공시 수정 성공' }),
  );
}

export function DeleteElectronicNotice() {
  return applyDecorators(
    ApiOperation({ summary: '전자공시 삭제' }),
    ApiParam({ name: 'id', description: '전자공시 ID' }),
    ApiResponse({ status: 200, description: '전자공시 삭제 성공' }),
  );
}

// ========== 카테고리 CRUD 데코레이터 ==========
export function GetAllElectronicNoticeCategories() {
  return applyDecorators(
    ApiOperation({ summary: '전자공시 카테고리 목록 조회' }),
    ApiResponse({ status: 200, description: '카테고리 목록 조회 성공' }),
  );
}

export function CreateElectronicNoticeCategory() {
  return applyDecorators(
    ApiOperation({ summary: '전자공시 카테고리 생성' }),
    ApiBody({ type: 'CreateElectronicNoticeCategoryDto' as any }),
    ApiResponse({ status: 201, description: '카테고리 생성 성공' }),
  );
}

export function UpdateElectronicNoticeCategory() {
  return applyDecorators(
    ApiOperation({ summary: '전자공시 카테고리 수정' }),
    ApiParam({ name: 'id', description: '카테고리 ID' }),
    ApiBody({ type: 'UpdateElectronicNoticeCategoryDto' as any }),
    ApiResponse({ status: 200, description: '카테고리 수정 성공' }),
  );
}

export function DeleteElectronicNoticeCategory() {
  return applyDecorators(
    ApiOperation({ summary: '전자공시 카테고리 삭제' }),
    ApiParam({ name: 'id', description: '카테고리 ID' }),
    ApiResponse({ status: 200, description: '카테고리 삭제 성공' }),
  );
}

// ========== 번역 CRUD 데코레이터 ==========
export function GetElectronicNoticeTranslations() {
  return applyDecorators(
    ApiOperation({ summary: '전자공시 번역 목록 조회' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiResponse({ status: 200, description: '번역 목록 조회 성공' }),
  );
}

export function GetElectronicNoticeTranslation() {
  return applyDecorators(
    ApiOperation({ summary: '전자공시 번역 조회' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiResponse({ status: 200, description: '번역 조회 성공' }),
  );
}

export function CreateElectronicNoticeTranslation() {
  return applyDecorators(
    ApiOperation({ summary: '전자공시 번역 생성' }),
    ApiBody({ type: 'CreateElectronicNoticeTranslationDto' as any }),
    ApiResponse({ status: 201, description: '번역 생성 성공' }),
  );
}

export function UpdateElectronicNoticeTranslation() {
  return applyDecorators(
    ApiOperation({ summary: '전자공시 번역 수정' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiBody({ type: 'UpdateElectronicNoticeTranslationDto' as any }),
    ApiResponse({ status: 200, description: '번역 수정 성공' }),
  );
}

export function DeleteElectronicNoticeTranslation() {
  return applyDecorators(
    ApiOperation({ summary: '전자공시 번역 삭제' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiResponse({ status: 200, description: '번역 삭제 성공' }),
  );
}

// ========== 첨부파일 CRUD 데코레이터 ==========
export function GetElectronicNoticeAttachments() {
  return applyDecorators(
    ApiOperation({ summary: '전자공시 첨부파일 목록 조회' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiResponse({ status: 200, description: '첨부파일 목록 조회 성공' }),
  );
}

export function GetElectronicNoticeAttachment() {
  return applyDecorators(
    ApiOperation({ summary: '전자공시 첨부파일 조회' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiParam({ name: 'attachmentId', description: '첨부파일 ID' }),
    ApiResponse({ status: 200, description: '첨부파일 조회 성공' }),
  );
}

export function CreateElectronicNoticeAttachment() {
  return applyDecorators(
    ApiOperation({ summary: '전자공시 첨부파일 생성' }),
    ApiBody({ type: 'CreateElectronicNoticeAttachmentDto' as any }),
    ApiResponse({ status: 201, description: '첨부파일 생성 성공' }),
  );
}

export function UpdateElectronicNoticeAttachment() {
  return applyDecorators(
    ApiOperation({ summary: '전자공시 첨부파일 수정' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiParam({ name: 'attachmentId', description: '첨부파일 ID' }),
    ApiBody({ type: 'UpdateElectronicNoticeAttachmentDto' as any }),
    ApiResponse({ status: 200, description: '첨부파일 수정 성공' }),
  );
}

export function DeleteElectronicNoticeAttachment() {
  return applyDecorators(
    ApiOperation({ summary: '전자공시 첨부파일 삭제' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiParam({ name: 'attachmentId', description: '첨부파일 ID' }),
    ApiResponse({ status: 200, description: '첨부파일 삭제 성공' }),
  );
}
