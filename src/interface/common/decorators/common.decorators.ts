import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { Get, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import {
  SendNotificationDto,
  NotificationResponseDto,
  EmployeeBasicResponseDto,
  DepartmentBasicResponseDto,
  PositionResponseDto,
  RankResponseDto,
  OrganizationHierarchyResponseDto,
} from '../dto/common.dto';

/**
 * 전체 직원 목록 조회 데코레이터
 */
export function GetAllEmployees() {
  return applyDecorators(
    Get('employees'),
    HttpCode(HttpStatus.OK),
    ApiOperation({
      summary: '전체 직원 목록 조회',
      description: `모든 직원의 목록을 조회합니다.

**동작:**
- 직원 기본 정보와 소속 부서, 직책, 직급 정보 포함
- 활성화된 직원만 조회
- 직원명 가나다순 정렬

**테스트 케이스:**
- 기본 조회: 전체 직원 목록 조회 성공
- 빈 목록 반환: 직원이 없는 경우 빈 배열 반환`,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: '직원 목록 조회 성공',
      type: [EmployeeBasicResponseDto],
    }),
  );
}

/**
 * 직원 상세 조회 데코레이터
 */
export function GetEmployee() {
  return applyDecorators(
    Get('employees/:id'),
    HttpCode(HttpStatus.OK),
    ApiOperation({
      summary: '직원 상세 조회',
      description: `특정 직원의 상세 정보를 조회합니다.

**동작:**
- 직원 기본 정보와 소속 부서, 직책, 직급 정보 포함
- 직원이 존재하지 않으면 404 에러 반환

**테스트 케이스:**
- 정상 조회: 존재하는 직원 ID로 상세 정보 조회 성공
- 존재하지 않는 직원: 404 NOT_FOUND 에러
- 잘못된 ID 형식: 400 BAD_REQUEST 에러`,
    }),
    ApiParam({
      name: 'id',
      description: '직원 ID',
      type: String,
      example: 'emp-001',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: '직원 상세 조회 성공',
      type: EmployeeBasicResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: '직원을 찾을 수 없습니다.',
    }),
  );
}

/**
 * 전체 부서 목록 조회 데코레이터
 */
export function GetAllDepartments() {
  return applyDecorators(
    Get('departments'),
    HttpCode(HttpStatus.OK),
    ApiOperation({
      summary: '전체 부서 목록 조회',
      description: `모든 부서의 목록을 조회합니다.

**동작:**
- 부서 기본 정보와 상위 부서 정보 포함
- 계층 구조 정보 포함
- 부서명 가나다순 정렬

**테스트 케이스:**
- 기본 조회: 전체 부서 목록 조회 성공
- 빈 목록 반환: 부서가 없는 경우 빈 배열 반환`,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: '부서 목록 조회 성공',
      type: [DepartmentBasicResponseDto],
    }),
  );
}

/**
 * 부서 상세 조회 데코레이터
 */
export function GetDepartment() {
  return applyDecorators(
    Get('departments/:id'),
    HttpCode(HttpStatus.OK),
    ApiOperation({
      summary: '부서 상세 조회',
      description: `특정 부서의 상세 정보를 조회합니다.

**동작:**
- 부서 기본 정보, 상위 부서, 소속 직원, 자식 부서 정보 포함
- 부서가 존재하지 않으면 404 에러 반환

**테스트 케이스:**
- 정상 조회: 존재하는 부서 ID로 상세 정보 조회 성공
- 존재하지 않는 부서: 404 NOT_FOUND 에러
- 잘못된 ID 형식: 400 BAD_REQUEST 에러`,
    }),
    ApiParam({
      name: 'id',
      description: '부서 ID',
      type: String,
      example: 'dept-001',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: '부서 상세 조회 성공',
      type: DepartmentBasicResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: '부서를 찾을 수 없습니다.',
    }),
  );
}

/**
 * 전체 직책 목록 조회 데코레이터
 */
export function GetAllPositions() {
  return applyDecorators(
    Get('positions'),
    HttpCode(HttpStatus.OK),
    ApiOperation({
      summary: '전체 직책 목록 조회',
      description: `모든 직책의 목록을 조회합니다.

**동작:**
- 직책 기본 정보 포함
- 직책 순서(order) 기준 정렬
- 활성화된 직책만 조회

**테스트 케이스:**
- 기본 조회: 전체 직책 목록 조회 성공
- 순서 정렬 확인: order 값이 높은 순으로 정렬`,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: '직책 목록 조회 성공',
      type: [PositionResponseDto],
    }),
  );
}

/**
 * 직책 상세 조회 데코레이터
 */
export function GetPosition() {
  return applyDecorators(
    Get('positions/:id'),
    HttpCode(HttpStatus.OK),
    ApiOperation({
      summary: '직책 상세 조회',
      description: `특정 직책의 상세 정보를 조회합니다.

**동작:**
- 직책 기본 정보와 해당 직책 직원 목록 포함
- 직책이 존재하지 않으면 404 에러 반환

**테스트 케이스:**
- 정상 조회: 존재하는 직책 ID로 상세 정보 조회 성공
- 직원 목록 포함: 해당 직책의 직원 목록 확인
- 존재하지 않는 직책: 404 NOT_FOUND 에러`,
    }),
    ApiParam({
      name: 'id',
      description: '직책 ID',
      type: String,
      example: 'pos-001',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: '직책 상세 조회 성공',
      type: PositionResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: '직책을 찾을 수 없습니다.',
    }),
  );
}

/**
 * 전체 직급 목록 조회 데코레이터
 */
export function GetAllRanks() {
  return applyDecorators(
    Get('ranks'),
    HttpCode(HttpStatus.OK),
    ApiOperation({
      summary: '전체 직급 목록 조회',
      description: `모든 직급의 목록을 조회합니다.

**동작:**
- 직급 기본 정보 포함
- 직급 순서(order) 기준 정렬
- 활성화된 직급만 조회

**테스트 케이스:**
- 기본 조회: 전체 직급 목록 조회 성공
- 순서 정렬 확인: order 값이 높은 순으로 정렬`,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: '직급 목록 조회 성공',
      type: [RankResponseDto],
    }),
  );
}

/**
 * 직급 상세 조회 데코레이터
 */
export function GetRank() {
  return applyDecorators(
    Get('ranks/:id'),
    HttpCode(HttpStatus.OK),
    ApiOperation({
      summary: '직급 상세 조회',
      description: `특정 직급의 상세 정보를 조회합니다.

**동작:**
- 직급 기본 정보와 해당 직급 직원 목록 포함
- 직급이 존재하지 않으면 404 에러 반환

**테스트 케이스:**
- 정상 조회: 존재하는 직급 ID로 상세 정보 조회 성공
- 직원 목록 포함: 해당 직급의 직원 목록 확인
- 존재하지 않는 직급: 404 NOT_FOUND 에러`,
    }),
    ApiParam({
      name: 'id',
      description: '직급 ID',
      type: String,
      example: 'rank-001',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: '직급 상세 조회 성공',
      type: RankResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: '직급을 찾을 수 없습니다.',
    }),
  );
}

/**
 * 조직 하이라키 조회 데코레이터
 */
export function GetOrganizationHierarchy() {
  return applyDecorators(
    Get('organization-hierarchy'),
    HttpCode(HttpStatus.OK),
    ApiOperation({
      summary: '조직 하이라키 조회',
      description: `전체 조직 계층 구조를 조회합니다.

**동작:**
- 최상위 부서부터 하위 부서까지 전체 계층 구조 반환
- 각 부서별 소속 직원 정보 포함 (옵션)
- 부서 깊이(depth) 정보 포함
- 전체 부서 수, 직원 수, 최대 깊이 통계 제공

**테스트 케이스:**
- 기본 조회: 전체 조직 하이라키 조회 성공 (직원 포함)
- 직원 제외 조회: includeEmployees=false로 부서 구조만 조회
- 통계 정보 확인: totalDepartments, totalEmployees, maxDepth 검증`,
    }),
    ApiQuery({
      name: 'includeEmployees',
      required: false,
      description: '직원 정보 포함 여부',
      type: Boolean,
      example: true,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: '조직 하이라키 조회 성공',
      type: OrganizationHierarchyResponseDto,
    }),
  );
}

/**
 * 알림 전송 데코레이터
 */
export function SendNotification() {
  return applyDecorators(
    Post(':entityId/notifications'),
    HttpCode(HttpStatus.CREATED),
    ApiOperation({
      summary: '알림 전송',
      description: `특정 문서/콘텐츠에 대한 알림을 전송합니다.

**동작:**
- 지정된 대상자 타입과 ID 목록에 따라 알림 전송
- 전송 성공/실패 개수 및 실패 사유 반환
- 알림 히스토리 저장

**테스트 케이스:**
- 전체 대상 전송: targetType=ALL로 전체 직원에게 알림 전송
- 부서별 전송: targetType=DEPARTMENT로 특정 부서 직원들에게 전송
- 개별 전송: targetType=INDIVIDUAL로 개별 직원에게 전송
- 직책별 전송: targetType=POSITION으로 특정 직책 직원들에게 전송
- 직급별 전송: targetType=RANK로 특정 직급 직원들에게 전송
- URL 포함: 알림 URL 포함하여 전송
- 전송 실패 처리: 일부 대상자 전송 실패 시 실패 목록 반환
- 필수 필드 누락: title 또는 content 누락 시 400 에러`,
    }),
    ApiParam({
      name: 'entityId',
      description: '문서/콘텐츠 ID',
      type: String,
      example: 'doc-001',
    }),
    ApiBody({ type: SendNotificationDto }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: '알림이 성공적으로 전송되었습니다.',
      type: NotificationResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: '잘못된 요청 데이터입니다.',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: '문서/콘텐츠를 찾을 수 없습니다.',
    }),
  );
}
