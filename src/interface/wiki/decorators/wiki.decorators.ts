import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

export function GetAllWikis() {
  return applyDecorators(
    ApiOperation({ summary: 'Wiki 목록 조회' }),
    ApiResponse({ status: 200, description: 'Wiki 목록 조회 성공' }),
  );
}

export function GetWiki() {
  return applyDecorators(
    ApiOperation({ summary: 'Wiki 상세 조회' }),
    ApiParam({ name: 'id', description: 'Wiki ID' }),
    ApiResponse({ status: 200, description: 'Wiki 상세 조회 성공' }),
  );
}

export function CreateWiki() {
  return applyDecorators(
    ApiOperation({ summary: 'Wiki 생성' }),
    ApiBody({ type: 'CreateWikiDto' as any }),
    ApiResponse({ status: 201, description: 'Wiki 생성 성공' }),
  );
}

export function UpdateWiki() {
  return applyDecorators(
    ApiOperation({ summary: 'Wiki 수정' }),
    ApiParam({ name: 'id', description: 'Wiki ID' }),
    ApiBody({ type: 'UpdateWikiDto' as any }),
    ApiResponse({ status: 200, description: 'Wiki 수정 성공' }),
  );
}

export function DeleteWiki() {
  return applyDecorators(
    ApiOperation({ summary: 'Wiki 삭제' }),
    ApiParam({ name: 'id', description: 'Wiki ID' }),
    ApiResponse({ status: 200, description: 'Wiki 삭제 성공' }),
  );
}

export function GetWikiFileSystem() {
  return applyDecorators(
    ApiOperation({ summary: 'Wiki 파일 시스템 조회' }),
    ApiResponse({ status: 200, description: 'Wiki 파일 시스템 조회 성공' }),
  );
}

export function CreateWikiFileSystemItem() {
  return applyDecorators(
    ApiOperation({ summary: 'Wiki 파일 시스템 항목 생성' }),
    ApiBody({ type: 'CreateWikiFileSystemDto' as any }),
    ApiResponse({ status: 201, description: '파일 시스템 항목 생성 성공' }),
  );
}

export function UpdateWikiFileSystemItem() {
  return applyDecorators(
    ApiOperation({ summary: 'Wiki 파일 시스템 항목 수정' }),
    ApiParam({ name: 'id', description: '파일 시스템 항목 ID' }),
    ApiBody({ type: 'UpdateWikiFileSystemDto' as any }),
    ApiResponse({ status: 200, description: '파일 시스템 항목 수정 성공' }),
  );
}

export function DeleteWikiFileSystemItem() {
  return applyDecorators(
    ApiOperation({ summary: 'Wiki 파일 시스템 항목 삭제' }),
    ApiParam({ name: 'id', description: '파일 시스템 항목 ID' }),
    ApiResponse({ status: 200, description: '파일 시스템 항목 삭제 성공' }),
  );
}

export function SearchWikis() {
  return applyDecorators(
    ApiOperation({ summary: 'Wiki 검색' }),
    ApiResponse({ status: 200, description: 'Wiki 검색 성공' }),
  );
}
