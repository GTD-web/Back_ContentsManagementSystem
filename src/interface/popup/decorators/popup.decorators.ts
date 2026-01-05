import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

export function GetAllPopups() {
  return applyDecorators(
    ApiOperation({ summary: '팝업 목록 조회' }),
    ApiResponse({ status: 200, description: '팝업 목록 조회 성공' }),
  );
}

export function GetPopup() {
  return applyDecorators(
    ApiOperation({ summary: '팝업 상세 조회' }),
    ApiParam({ name: 'id', description: '팝업 ID' }),
    ApiResponse({ status: 200, description: '팝업 상세 조회 성공' }),
  );
}

export function CreatePopup() {
  return applyDecorators(
    ApiOperation({ summary: '팝업 생성' }),
    ApiBody({ type: 'CreatePopupDto' as any }),
    ApiResponse({ status: 201, description: '팝업 생성 성공' }),
  );
}

export function UpdatePopup() {
  return applyDecorators(
    ApiOperation({ summary: '팝업 수정' }),
    ApiParam({ name: 'id', description: '팝업 ID' }),
    ApiBody({ type: 'UpdatePopupDto' as any }),
    ApiResponse({ status: 200, description: '팝업 수정 성공' }),
  );
}

export function DeletePopup() {
  return applyDecorators(
    ApiOperation({ summary: '팝업 삭제' }),
    ApiParam({ name: 'id', description: '팝업 ID' }),
    ApiResponse({ status: 200, description: '팝업 삭제 성공' }),
  );
}

export function GetAllPopupCategories() {
  return applyDecorators(
    ApiOperation({ summary: '팝업 카테고리 목록 조회' }),
    ApiResponse({ status: 200, description: '카테고리 목록 조회 성공' }),
  );
}

export function CreatePopupCategory() {
  return applyDecorators(
    ApiOperation({ summary: '팝업 카테고리 생성' }),
    ApiBody({ type: 'CreatePopupCategoryDto' as any }),
    ApiResponse({ status: 201, description: '카테고리 생성 성공' }),
  );
}

export function UpdatePopupCategory() {
  return applyDecorators(
    ApiOperation({ summary: '팝업 카테고리 수정' }),
    ApiParam({ name: 'id', description: '카테고리 ID' }),
    ApiBody({ type: 'UpdatePopupCategoryDto' as any }),
    ApiResponse({ status: 200, description: '카테고리 수정 성공' }),
  );
}

export function DeletePopupCategory() {
  return applyDecorators(
    ApiOperation({ summary: '팝업 카테고리 삭제' }),
    ApiParam({ name: 'id', description: '카테고리 ID' }),
    ApiResponse({ status: 200, description: '카테고리 삭제 성공' }),
  );
}

export function GetPopupTranslations() {
  return applyDecorators(
    ApiOperation({ summary: '팝업 번역 목록 조회' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiResponse({ status: 200, description: '번역 목록 조회 성공' }),
  );
}

export function GetPopupTranslation() {
  return applyDecorators(
    ApiOperation({ summary: '팝업 번역 조회' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiResponse({ status: 200, description: '번역 조회 성공' }),
  );
}

export function CreatePopupTranslation() {
  return applyDecorators(
    ApiOperation({ summary: '팝업 번역 생성' }),
    ApiBody({ type: 'CreatePopupTranslationDto' as any }),
    ApiResponse({ status: 201, description: '번역 생성 성공' }),
  );
}

export function UpdatePopupTranslation() {
  return applyDecorators(
    ApiOperation({ summary: '팝업 번역 수정' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiBody({ type: 'UpdatePopupTranslationDto' as any }),
    ApiResponse({ status: 200, description: '번역 수정 성공' }),
  );
}

export function DeletePopupTranslation() {
  return applyDecorators(
    ApiOperation({ summary: '팝업 번역 삭제' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiResponse({ status: 200, description: '번역 삭제 성공' }),
  );
}

export function GetPopupAttachments() {
  return applyDecorators(
    ApiOperation({ summary: '팝업 첨부파일 목록 조회' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiResponse({ status: 200, description: '첨부파일 목록 조회 성공' }),
  );
}

export function GetPopupAttachment() {
  return applyDecorators(
    ApiOperation({ summary: '팝업 첨부파일 조회' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiParam({ name: 'attachmentId', description: '첨부파일 ID' }),
    ApiResponse({ status: 200, description: '첨부파일 조회 성공' }),
  );
}

export function CreatePopupAttachment() {
  return applyDecorators(
    ApiOperation({ summary: '팝업 첨부파일 생성' }),
    ApiBody({ type: 'CreatePopupAttachmentDto' as any }),
    ApiResponse({ status: 201, description: '첨부파일 생성 성공' }),
  );
}

export function UpdatePopupAttachment() {
  return applyDecorators(
    ApiOperation({ summary: '팝업 첨부파일 수정' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiParam({ name: 'attachmentId', description: '첨부파일 ID' }),
    ApiBody({ type: 'UpdatePopupAttachmentDto' as any }),
    ApiResponse({ status: 200, description: '첨부파일 수정 성공' }),
  );
}

export function DeletePopupAttachment() {
  return applyDecorators(
    ApiOperation({ summary: '팝업 첨부파일 삭제' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiParam({ name: 'attachmentId', description: '첨부파일 ID' }),
    ApiResponse({ status: 200, description: '첨부파일 삭제 성공' }),
  );
}
