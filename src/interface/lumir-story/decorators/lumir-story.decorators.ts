import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

export function GetAllLumirStories() {
  return applyDecorators(
    ApiOperation({ summary: '루미르 스토리 목록 조회' }),
    ApiResponse({ status: 200, description: '스토리 목록 조회 성공' }),
  );
}

export function GetLumirStory() {
  return applyDecorators(
    ApiOperation({ summary: '루미르 스토리 상세 조회' }),
    ApiParam({ name: 'id', description: '스토리 ID' }),
    ApiResponse({ status: 200, description: '스토리 상세 조회 성공' }),
  );
}

export function CreateLumirStory() {
  return applyDecorators(
    ApiOperation({ summary: '루미르 스토리 생성' }),
    ApiBody({ type: 'CreateLumirStoryDto' as any }),
    ApiResponse({ status: 201, description: '스토리 생성 성공' }),
  );
}

export function UpdateLumirStory() {
  return applyDecorators(
    ApiOperation({ summary: '루미르 스토리 수정' }),
    ApiParam({ name: 'id', description: '스토리 ID' }),
    ApiBody({ type: 'UpdateLumirStoryDto' as any }),
    ApiResponse({ status: 200, description: '스토리 수정 성공' }),
  );
}

export function DeleteLumirStory() {
  return applyDecorators(
    ApiOperation({ summary: '루미르 스토리 삭제' }),
    ApiParam({ name: 'id', description: '스토리 ID' }),
    ApiResponse({ status: 200, description: '스토리 삭제 성공' }),
  );
}

export function GetAllLumirStoryCategories() {
  return applyDecorators(
    ApiOperation({ summary: '스토리 카테고리 목록 조회' }),
    ApiResponse({ status: 200, description: '카테고리 목록 조회 성공' }),
  );
}

export function CreateLumirStoryCategory() {
  return applyDecorators(
    ApiOperation({ summary: '스토리 카테고리 생성' }),
    ApiBody({ type: 'CreateLumirStoryCategoryDto' as any }),
    ApiResponse({ status: 201, description: '카테고리 생성 성공' }),
  );
}

export function UpdateLumirStoryCategory() {
  return applyDecorators(
    ApiOperation({ summary: '스토리 카테고리 수정' }),
    ApiParam({ name: 'id', description: '카테고리 ID' }),
    ApiBody({ type: 'UpdateLumirStoryCategoryDto' as any }),
    ApiResponse({ status: 200, description: '카테고리 수정 성공' }),
  );
}

export function DeleteLumirStoryCategory() {
  return applyDecorators(
    ApiOperation({ summary: '스토리 카테고리 삭제' }),
    ApiParam({ name: 'id', description: '카테고리 ID' }),
    ApiResponse({ status: 200, description: '카테고리 삭제 성공' }),
  );
}

export function GetLumirStoryTranslations() {
  return applyDecorators(
    ApiOperation({ summary: '스토리 번역 목록 조회' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiResponse({ status: 200, description: '번역 목록 조회 성공' }),
  );
}

export function GetLumirStoryTranslation() {
  return applyDecorators(
    ApiOperation({ summary: '스토리 번역 조회' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiResponse({ status: 200, description: '번역 조회 성공' }),
  );
}

export function CreateLumirStoryTranslation() {
  return applyDecorators(
    ApiOperation({ summary: '스토리 번역 생성' }),
    ApiBody({ type: 'CreateLumirStoryTranslationDto' as any }),
    ApiResponse({ status: 201, description: '번역 생성 성공' }),
  );
}

export function UpdateLumirStoryTranslation() {
  return applyDecorators(
    ApiOperation({ summary: '스토리 번역 수정' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiBody({ type: 'UpdateLumirStoryTranslationDto' as any }),
    ApiResponse({ status: 200, description: '번역 수정 성공' }),
  );
}

export function DeleteLumirStoryTranslation() {
  return applyDecorators(
    ApiOperation({ summary: '스토리 번역 삭제' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiResponse({ status: 200, description: '번역 삭제 성공' }),
  );
}

export function GetLumirStoryAttachments() {
  return applyDecorators(
    ApiOperation({ summary: '스토리 첨부파일 목록 조회' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiResponse({ status: 200, description: '첨부파일 목록 조회 성공' }),
  );
}

export function GetLumirStoryAttachment() {
  return applyDecorators(
    ApiOperation({ summary: '스토리 첨부파일 조회' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiParam({ name: 'attachmentId', description: '첨부파일 ID' }),
    ApiResponse({ status: 200, description: '첨부파일 조회 성공' }),
  );
}

export function CreateLumirStoryAttachment() {
  return applyDecorators(
    ApiOperation({ summary: '스토리 첨부파일 생성' }),
    ApiBody({ type: 'CreateLumirStoryAttachmentDto' as any }),
    ApiResponse({ status: 201, description: '첨부파일 생성 성공' }),
  );
}

export function UpdateLumirStoryAttachment() {
  return applyDecorators(
    ApiOperation({ summary: '스토리 첨부파일 수정' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiParam({ name: 'attachmentId', description: '첨부파일 ID' }),
    ApiBody({ type: 'UpdateLumirStoryAttachmentDto' as any }),
    ApiResponse({ status: 200, description: '첨부파일 수정 성공' }),
  );
}

export function DeleteLumirStoryAttachment() {
  return applyDecorators(
    ApiOperation({ summary: '스토리 첨부파일 삭제' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiParam({ name: 'attachmentId', description: '첨부파일 ID' }),
    ApiResponse({ status: 200, description: '첨부파일 삭제 성공' }),
  );
}
