import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { Get, Post, Put, Delete } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import {
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
  AnnouncementResponseDto,
  CreateAnnouncementCategoryDto,
  UpdateAnnouncementCategoryDto,
  AnnouncementCategoryResponseDto,
  AnnouncementAttachmentResponseDto,
  AnnouncementTargetResponseDto,
  AnnouncementRespondedResponseDto,
} from '../dto/announcement.dto';

/**
 * 공지사항 목록 조회 데코레이터
 */
export function GetAllAnnouncements() {
  return applyDecorators(
    Get(),
    HttpCode(HttpStatus.OK),
    ApiOperation({
      summary: '공지사항 목록 조회',
      description: `모든 공지사항의 목록을 조회합니다.

**동작:**
- 공지사항 목록을 최신순으로 정렬하여 반환
- 상단 고정 공지사항을 최상단에 표시
- 만료되지 않은 공지사항만 기본 조회
- 읽음/응답 통계 정보 포함

**테스트 케이스:**
- 기본 조회: 전체 공지사항 목록 조회 성공
- 정렬 확인: 상단 고정 공지사항이 최상단에 위치
- 빈 목록: 공지사항이 없는 경우 빈 배열 반환`,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: '공지사항 목록 조회 성공',
      type: [AnnouncementResponseDto],
    }),
  );
}

/**
 * 공지사항 상세 조회 데코레이터
 */
export function GetAnnouncement() {
  return applyDecorators(
    Get(':id'),
    HttpCode(HttpStatus.OK),
    ApiOperation({
      summary: '공지사항 상세 조회',
      description: `특정 공지사항의 상세 정보를 조회합니다.

**동작:**
- 공지사항 기본 정보 조회
- 대상자, 첨부파일, 응답 상태 정보 포함
- 조회 시 조회수 1 증가
- 존재하지 않으면 404 에러 반환

**테스트 케이스:**
- 정상 조회: 존재하는 공지사항 ID로 상세 정보 조회 성공
- 조회수 증가: 조회 시 hits 값 1 증가 확인
- 존재하지 않는 공지사항: 404 NOT_FOUND 에러`,
    }),
    ApiParam({
      name: 'id',
      description: '공지사항 ID',
      type: String,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: '공지사항 상세 조회 성공',
      type: AnnouncementResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: '공지사항을 찾을 수 없습니다.',
    }),
  );
}

/**
 * 공지사항 생성 데코레이터
 */
export function CreateAnnouncement() {
  return applyDecorators(
    Post(),
    HttpCode(HttpStatus.CREATED),
    ApiOperation({
      summary: '공지사항 생성',
      description: `새로운 공지사항을 생성합니다.

**동작:**
- 공지사항 기본 정보 저장
- 대상 직원 지정
- 첨부파일 URL 저장
- 필독 여부 설정
- 상태는 DRAFT로 생성

**테스트 케이스:**
- 기본 생성: 필수 필드만으로 공지사항 생성 성공
- 첨부파일 포함: attachments 배열에 파일 URL 포함하여 생성
- 필독 공지: mustRead=true로 필독 공지사항 생성
- 상단 고정: isFixed=true로 상단 고정 공지사항 생성
- 대상자 지정: employeeIds 배열로 대상 직원 지정
- 필수 필드 누락: title 또는 content 누락 시 400 에러`,
    }),
    ApiBody({ type: CreateAnnouncementDto }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: '공지사항이 성공적으로 생성되었습니다.',
      type: AnnouncementResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: '잘못된 요청 데이터입니다.',
    }),
  );
}

/**
 * 공지사항 수정 데코레이터
 */
export function UpdateAnnouncement() {
  return applyDecorators(
    Put(':id'),
    HttpCode(HttpStatus.OK),
    ApiOperation({
      summary: '공지사항 수정',
      description: `기존 공지사항을 수정합니다.

**동작:**
- 공지사항 부분 업데이트 지원
- 수정 일시 자동 업데이트
- 존재하지 않으면 404 에러 반환

**테스트 케이스:**
- 제목 수정: title 필드만 수정 성공
- 내용 수정: content 필드만 수정 성공
- 여러 필드 수정: 여러 필드 동시 수정 성공
- 존재하지 않는 공지사항: 404 NOT_FOUND 에러`,
    }),
    ApiParam({
      name: 'id',
      description: '공지사항 ID',
      type: String,
    }),
    ApiBody({ type: UpdateAnnouncementDto }),
    ApiResponse({
      status: HttpStatus.OK,
      description: '공지사항이 성공적으로 수정되었습니다.',
      type: AnnouncementResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: '공지사항을 찾을 수 없습니다.',
    }),
  );
}

/**
 * 공지사항 삭제 데코레이터
 */
export function DeleteAnnouncement() {
  return applyDecorators(
    Delete(':id'),
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({
      summary: '공지사항 삭제',
      description: `공지사항을 삭제합니다 (Soft Delete).

**동작:**
- deletedAt 필드에 현재 시각 저장
- 관련 데이터는 유지 (대상자, 첨부파일 등)
- 조회 시 제외됨

**테스트 케이스:**
- 정상 삭제: 존재하는 공지사항 삭제 성공
- 삭제 확인: 삭제 후 조회 시 404 에러
- 존재하지 않는 공지사항: 404 NOT_FOUND 에러`,
    }),
    ApiParam({
      name: 'id',
      description: '공지사항 ID',
      type: String,
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: '공지사항이 성공적으로 삭제되었습니다.',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: '공지사항을 찾을 수 없습니다.',
    }),
  );
}

/**
 * 카테고리 목록 조회 데코레이터
 */
export function GetAllCategories() {
  return applyDecorators(
    Get('categories'),
    HttpCode(HttpStatus.OK),
    ApiOperation({
      summary: '카테고리 목록 조회',
      description: `모든 공지사항 카테고리 목록을 조회합니다.

**동작:**
- 카테고리 기본 정보 조회
- 생성일 기준 정렬

**테스트 케이스:**
- 기본 조회: 전체 카테고리 목록 조회 성공
- 빈 목록: 카테고리가 없는 경우 빈 배열 반환`,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: '카테고리 목록 조회 성공',
      type: [AnnouncementCategoryResponseDto],
    }),
  );
}

/**
 * 카테고리 생성 데코레이터
 */
export function CreateCategory() {
  return applyDecorators(
    Post('categories'),
    HttpCode(HttpStatus.CREATED),
    ApiOperation({
      summary: '카테고리 생성',
      description: `새로운 카테고리를 생성합니다.

**동작:**
- 카테고리 이름과 설명 저장
- 중복 이름 검증

**테스트 케이스:**
- 기본 생성: 카테고리 생성 성공
- 중복 이름: 동일한 이름의 카테고리 생성 시 409 에러
- 필수 필드 누락: name 누락 시 400 에러`,
    }),
    ApiBody({ type: CreateAnnouncementCategoryDto }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: '카테고리가 성공적으로 생성되었습니다.',
      type: AnnouncementCategoryResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: '잘못된 요청 데이터입니다.',
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: '이미 존재하는 카테고리 이름입니다.',
    }),
  );
}

/**
 * 카테고리 수정 데코레이터
 */
export function UpdateCategory() {
  return applyDecorators(
    Put('categories/:id'),
    HttpCode(HttpStatus.OK),
    ApiOperation({
      summary: '카테고리 수정',
      description: `기존 카테고리를 수정합니다.

**동작:**
- 카테고리 이름 또는 설명 수정
- 부분 업데이트 지원

**테스트 케이스:**
- 이름 수정: name 필드만 수정 성공
- 설명 수정: description 필드만 수정 성공
- 존재하지 않는 카테고리: 404 NOT_FOUND 에러`,
    }),
    ApiParam({
      name: 'id',
      description: '카테고리 ID',
      type: String,
    }),
    ApiBody({ type: UpdateAnnouncementCategoryDto }),
    ApiResponse({
      status: HttpStatus.OK,
      description: '카테고리가 성공적으로 수정되었습니다.',
      type: AnnouncementCategoryResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: '카테고리를 찾을 수 없습니다.',
    }),
  );
}

/**
 * 카테고리 삭제 데코레이터
 */
export function DeleteCategory() {
  return applyDecorators(
    Delete('categories/:id'),
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({
      summary: '카테고리 삭제',
      description: `카테고리를 삭제합니다.

**동작:**
- 카테고리 삭제
- 해당 카테고리를 사용하는 공지사항이 있으면 409 에러

**테스트 케이스:**
- 정상 삭제: 사용되지 않는 카테고리 삭제 성공
- 사용 중인 카테고리: 공지사항이 있는 카테고리 삭제 시 409 에러
- 존재하지 않는 카테고리: 404 NOT_FOUND 에러`,
    }),
    ApiParam({
      name: 'id',
      description: '카테고리 ID',
      type: String,
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: '카테고리가 성공적으로 삭제되었습니다.',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: '카테고리를 찾을 수 없습니다.',
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: '사용 중인 카테고리는 삭제할 수 없습니다.',
    }),
  );
}

/**
 * 첨부파일 목록 조회 데코레이터
 */
export function GetAnnouncementAttachments() {
  return applyDecorators(
    Get(':id/attachments'),
    HttpCode(HttpStatus.OK),
    ApiOperation({
      summary: '첨부파일 목록 조회',
      description: `특정 공지사항의 모든 첨부파일을 조회합니다.

**동작:**
- 공지사항에 포함된 첨부파일 목록 반환
- 파일명, URL, 크기, 타입 정보 포함

**테스트 케이스:**
- 정상 조회: 첨부파일 목록 조회 성공
- 빈 목록: 첨부파일이 없는 경우 빈 배열 반환`,
    }),
    ApiParam({
      name: 'id',
      description: '공지사항 ID',
      type: String,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: '첨부파일 목록 조회 성공',
      type: [AnnouncementAttachmentResponseDto],
    }),
  );
}

/**
 * 대상자 목록 조회 데코레이터
 */
export function GetAnnouncementTargets() {
  return applyDecorators(
    Get(':id/targets'),
    HttpCode(HttpStatus.OK),
    ApiOperation({
      summary: '대상자 목록 조회',
      description: `특정 공지사항의 모든 대상자를 조회합니다.

**동작:**
- 공지사항 대상자 목록 반환
- 읽음/응답 여부 및 시각 포함
- 직원 기본 정보 포함

**테스트 케이스:**
- 정상 조회: 대상자 목록 조회 성공
- 읽음 상태 확인: isRead, readAt 필드 확인
- 응답 상태 확인: isSubmitted, submittedAt 필드 확인`,
    }),
    ApiParam({
      name: 'id',
      description: '공지사항 ID',
      type: String,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: '대상자 목록 조회 성공',
      type: [AnnouncementTargetResponseDto],
    }),
  );
}

/**
 * 응답 상태 목록 조회 데코레이터
 */
export function GetAnnouncementResponses() {
  return applyDecorators(
    Get(':id/responses'),
    HttpCode(HttpStatus.OK),
    ApiOperation({
      summary: '응답 상태 목록 조회',
      description: `특정 공지사항의 모든 응답 상태를 조회합니다.

**동작:**
- 응답을 제출한 직원 목록 반환
- 응답 메시지 및 응답 시각 포함
- 직원 기본 정보 포함

**테스트 케이스:**
- 정상 조회: 응답 상태 목록 조회 성공
- 빈 목록: 응답이 없는 경우 빈 배열 반환`,
    }),
    ApiParam({
      name: 'id',
      description: '공지사항 ID',
      type: String,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: '응답 상태 목록 조회 성공',
      type: [AnnouncementRespondedResponseDto],
    }),
  );
}
