import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

export function GetAllVideoGalleries() {
  return applyDecorators(
    ApiOperation({ summary: '비디오 갤러리 목록 조회' }),
    ApiResponse({ status: 200, description: '비디오 갤러리 목록 조회 성공' }),
  );
}

export function GetVideoGallery() {
  return applyDecorators(
    ApiOperation({ summary: '비디오 갤러리 상세 조회' }),
    ApiParam({ name: 'id', description: '비디오 갤러리 ID' }),
    ApiResponse({ status: 200, description: '비디오 갤러리 상세 조회 성공' }),
  );
}

export function CreateVideoGallery() {
  return applyDecorators(
    ApiOperation({ summary: '비디오 갤러리 생성' }),
    ApiBody({ type: 'CreateVideoGalleryDto' as any }),
    ApiResponse({ status: 201, description: '비디오 갤러리 생성 성공' }),
  );
}

export function UpdateVideoGallery() {
  return applyDecorators(
    ApiOperation({ summary: '비디오 갤러리 수정' }),
    ApiParam({ name: 'id', description: '비디오 갤러리 ID' }),
    ApiBody({ type: 'UpdateVideoGalleryDto' as any }),
    ApiResponse({ status: 200, description: '비디오 갤러리 수정 성공' }),
  );
}

export function DeleteVideoGallery() {
  return applyDecorators(
    ApiOperation({ summary: '비디오 갤러리 삭제' }),
    ApiParam({ name: 'id', description: '비디오 갤러리 ID' }),
    ApiResponse({ status: 200, description: '비디오 갤러리 삭제 성공' }),
  );
}

export function GetAllVideoGalleryCategories() {
  return applyDecorators(
    ApiOperation({ summary: '비디오 갤러리 카테고리 목록 조회' }),
    ApiResponse({ status: 200, description: '카테고리 목록 조회 성공' }),
  );
}

export function CreateVideoGalleryCategory() {
  return applyDecorators(
    ApiOperation({ summary: '비디오 갤러리 카테고리 생성' }),
    ApiBody({ type: 'CreateVideoGalleryCategoryDto' as any }),
    ApiResponse({ status: 201, description: '카테고리 생성 성공' }),
  );
}

export function UpdateVideoGalleryCategory() {
  return applyDecorators(
    ApiOperation({ summary: '비디오 갤러리 카테고리 수정' }),
    ApiParam({ name: 'id', description: '카테고리 ID' }),
    ApiBody({ type: 'UpdateVideoGalleryCategoryDto' as any }),
    ApiResponse({ status: 200, description: '카테고리 수정 성공' }),
  );
}

export function DeleteVideoGalleryCategory() {
  return applyDecorators(
    ApiOperation({ summary: '비디오 갤러리 카테고리 삭제' }),
    ApiParam({ name: 'id', description: '카테고리 ID' }),
    ApiResponse({ status: 200, description: '카테고리 삭제 성공' }),
  );
}

export function GetVideoGalleryTranslations() {
  return applyDecorators(
    ApiOperation({ summary: '비디오 갤러리 번역 목록 조회' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiResponse({ status: 200, description: '번역 목록 조회 성공' }),
  );
}

export function GetVideoGalleryTranslation() {
  return applyDecorators(
    ApiOperation({ summary: '비디오 갤러리 번역 조회' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiResponse({ status: 200, description: '번역 조회 성공' }),
  );
}

export function CreateVideoGalleryTranslation() {
  return applyDecorators(
    ApiOperation({ summary: '비디오 갤러리 번역 생성' }),
    ApiBody({ type: 'CreateVideoGalleryTranslationDto' as any }),
    ApiResponse({ status: 201, description: '번역 생성 성공' }),
  );
}

export function UpdateVideoGalleryTranslation() {
  return applyDecorators(
    ApiOperation({ summary: '비디오 갤러리 번역 수정' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiBody({ type: 'UpdateVideoGalleryTranslationDto' as any }),
    ApiResponse({ status: 200, description: '번역 수정 성공' }),
  );
}

export function DeleteVideoGalleryTranslation() {
  return applyDecorators(
    ApiOperation({ summary: '비디오 갤러리 번역 삭제' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiResponse({ status: 200, description: '번역 삭제 성공' }),
  );
}

export function GetVideoGalleryAttachments() {
  return applyDecorators(
    ApiOperation({ summary: '비디오 갤러리 첨부파일 목록 조회' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiResponse({ status: 200, description: '첨부파일 목록 조회 성공' }),
  );
}

export function GetVideoGalleryAttachment() {
  return applyDecorators(
    ApiOperation({ summary: '비디오 갤러리 첨부파일 조회' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiParam({ name: 'attachmentId', description: '첨부파일 ID' }),
    ApiResponse({ status: 200, description: '첨부파일 조회 성공' }),
  );
}

export function CreateVideoGalleryAttachment() {
  return applyDecorators(
    ApiOperation({ summary: '비디오 갤러리 첨부파일 생성' }),
    ApiBody({ type: 'CreateVideoGalleryAttachmentDto' as any }),
    ApiResponse({ status: 201, description: '첨부파일 생성 성공' }),
  );
}

export function UpdateVideoGalleryAttachment() {
  return applyDecorators(
    ApiOperation({ summary: '비디오 갤러리 첨부파일 수정' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiParam({ name: 'attachmentId', description: '첨부파일 ID' }),
    ApiBody({ type: 'UpdateVideoGalleryAttachmentDto' as any }),
    ApiResponse({ status: 200, description: '첨부파일 수정 성공' }),
  );
}

export function DeleteVideoGalleryAttachment() {
  return applyDecorators(
    ApiOperation({ summary: '비디오 갤러리 첨부파일 삭제' }),
    ApiParam({ name: 'documentId', description: '문서 ID' }),
    ApiParam({ name: 'languageId', description: '언어 ID' }),
    ApiParam({ name: 'attachmentId', description: '첨부파일 ID' }),
    ApiResponse({ status: 200, description: '첨부파일 삭제 성공' }),
  );
}
