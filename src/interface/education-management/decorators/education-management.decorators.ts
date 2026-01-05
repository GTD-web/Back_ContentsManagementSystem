import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

export function GetAllEducationManagements() {
  return applyDecorators(
    ApiOperation({ summary: '교육 관리 목록 조회' }),
    ApiResponse({ status: 200, description: '교육 관리 목록 조회 성공' }),
  );
}

export function GetEducationManagement() {
  return applyDecorators(
    ApiOperation({ summary: '교육 관리 상세 조회' }),
    ApiParam({ name: 'id', description: '교육 관리 ID' }),
    ApiResponse({ status: 200, description: '교육 관리 상세 조회 성공' }),
  );
}

export function CreateEducationManagement() {
  return applyDecorators(
    ApiOperation({ summary: '교육 관리 생성' }),
    ApiBody({ type: 'CreateEducationManagementDto' as any }),
    ApiResponse({ status: 201, description: '교육 관리 생성 성공' }),
  );
}

export function UpdateEducationManagement() {
  return applyDecorators(
    ApiOperation({ summary: '교육 관리 수정' }),
    ApiParam({ name: 'id', description: '교육 관리 ID' }),
    ApiBody({ type: 'UpdateEducationManagementDto' as any }),
    ApiResponse({ status: 200, description: '교육 관리 수정 성공' }),
  );
}

export function DeleteEducationManagement() {
  return applyDecorators(
    ApiOperation({ summary: '교육 관리 삭제' }),
    ApiParam({ name: 'id', description: '교육 관리 ID' }),
    ApiResponse({ status: 200, description: '교육 관리 삭제 성공' }),
  );
}

export function GetAttendees() {
  return applyDecorators(
    ApiOperation({ summary: '수강자 목록 조회' }),
    ApiParam({ name: 'id', description: '교육 관리 ID' }),
    ApiResponse({ status: 200, description: '수강자 목록 조회 성공' }),
  );
}

export function UpdateAttendeeStatus() {
  return applyDecorators(
    ApiOperation({ summary: '수강자 상태 업데이트' }),
    ApiParam({ name: 'id', description: '교육 관리 ID' }),
    ApiParam({ name: 'attendeeId', description: '수강자 ID' }),
    ApiBody({ type: 'UpdateAttendeeStatusDto' as any }),
    ApiResponse({ status: 200, description: '수강자 상태 업데이트 성공' }),
  );
}

export function GetEducationManagementAttachments() {
  return applyDecorators(
    ApiOperation({ summary: '교육 관리 첨부파일 목록 조회' }),
    ApiParam({ name: 'id', description: '교육 관리 ID' }),
    ApiResponse({ status: 200, description: '첨부파일 목록 조회 성공' }),
  );
}

export function GetEducationManagementAttachment() {
  return applyDecorators(
    ApiOperation({ summary: '교육 관리 첨부파일 조회' }),
    ApiParam({ name: 'id', description: '교육 관리 ID' }),
    ApiParam({ name: 'attachmentId', description: '첨부파일 ID' }),
    ApiResponse({ status: 200, description: '첨부파일 조회 성공' }),
  );
}

export function CreateEducationManagementAttachment() {
  return applyDecorators(
    ApiOperation({ summary: '교육 관리 첨부파일 생성' }),
    ApiBody({ type: 'CreateEducationManagementAttachmentDto' as any }),
    ApiResponse({ status: 201, description: '첨부파일 생성 성공' }),
  );
}

export function UpdateEducationManagementAttachment() {
  return applyDecorators(
    ApiOperation({ summary: '교육 관리 첨부파일 수정' }),
    ApiParam({ name: 'id', description: '교육 관리 ID' }),
    ApiParam({ name: 'attachmentId', description: '첨부파일 ID' }),
    ApiBody({ type: 'UpdateEducationManagementAttachmentDto' as any }),
    ApiResponse({ status: 200, description: '첨부파일 수정 성공' }),
  );
}

export function DeleteEducationManagementAttachment() {
  return applyDecorators(
    ApiOperation({ summary: '교육 관리 첨부파일 삭제' }),
    ApiParam({ name: 'id', description: '교육 관리 ID' }),
    ApiParam({ name: 'attachmentId', description: '첨부파일 ID' }),
    ApiResponse({ status: 200, description: '첨부파일 삭제 성공' }),
  );
}
