/**
 * CMS 통합 서비스 인터페이스
 *
 * @description
 * - 직원, 부서, 직책, 직급, 조직 하이라키에 대한 조회 메서드와 알림 전송 메서드를 정의합니다.
 * - 백엔드 API와의 계약을 추상화하여 Mock 서비스와 실 API 서비스의 교체를 용이하게 합니다.
 * - 모든 CMS 섹션에서 공통으로 사용할 수 있는 통합 서비스 인터페이스입니다.
 */

import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { EmployeeDto } from '@domain/common/employee/employee.types';
import type { DepartmentDto } from '@domain/common/department/department.types';
import type { PositionDto } from '@domain/common/position';
import type { RankDto } from '@domain/common/rank';
import type { OrganizationHierarchyDto } from '@domain/common/organization';
import type {
  NotificationRequestDto,
  NotificationResponseDto,
} from '@domain/common/notification';

/**
 * CMS 통합 서비스 인터페이스
 *
 * @description
 * - 직원, 부서, 직책, 직급, 조직 하이라키: 조회 메서드만 제공
 * - 알림: 전송 메서드만 제공
 */
export interface CmsCommonService {
  // ========== 직원 조회 메서드 ==========
  /**
   * 직원 목록 조회
   *
   * 직책, 직급, 부서 정보가 포함된 DTO를 반환합니다.
   */
  직원_목록을_조회_한다: () => Promise<ApiResponse<EmployeeDto[]>>;

  /**
   * 직원 상세 조회
   *
   * @param employeeId - 조회할 직원 ID
   *   - 직책, 직급, 부서 정보가 포함된 DTO를 반환합니다.
   */
  직원을_조회_한다: (employeeId: string) => Promise<ApiResponse<EmployeeDto>>;

  // ========== 부서 조회 메서드 ==========
  /**
   * 부서 목록 조회
   *
   * 상위 부서 정보가 포함된 DTO를 반환합니다.
   */
  부서_목록을_조회_한다: () => Promise<ApiResponse<DepartmentDto[]>>;

  /**
   * 부서 상세 조회
   *
   * @param departmentId - 조회할 부서 ID
   *   - 상위 부서, 소속 직원, 자식 부서 정보가 포함된 DTO를 반환합니다.
   */
  부서를_조회_한다: (
    departmentId: string,
  ) => Promise<ApiResponse<DepartmentDto>>;

  // ========== 직책 조회 메서드 ==========
  /**
   * 직책 목록 조회
   */
  직책_목록을_조회_한다: () => Promise<ApiResponse<PositionDto[]>>;

  /**
   * 직책 상세 조회
   *
   * @param positionId - 조회할 직책 ID
   *   - 해당 직책을 가진 직원 목록이 포함된 DTO를 반환합니다.
   */
  직책을_조회_한다: (positionId: string) => Promise<ApiResponse<PositionDto>>;

  // ========== 직급 조회 메서드 ==========
  /**
   * 직급 목록 조회
   */
  직급_목록을_조회_한다: () => Promise<ApiResponse<RankDto[]>>;

  /**
   * 직급 상세 조회
   *
   * @param rankId - 조회할 직급 ID
   *   - 해당 직급을 가진 직원 목록이 포함된 DTO를 반환합니다.
   */
  직급을_조회_한다: (rankId: string) => Promise<ApiResponse<RankDto>>;

  // ========== 조직 하이라키 조회 메서드 ==========
  /**
   * 조직 하이라키 조회
   *
   * 전체 조직 계층 구조를 조회합니다.
   * 각 부서의 직원 정보가 포함된 DTO를 반환합니다.
   *
   * @param options - 조회 옵션
   *   - includeEmployees: 직원 정보 포함 여부 (기본값: true)
   */
  조직_하이라키를_조회_한다: (options?: {
    includeEmployees?: boolean;
  }) => Promise<ApiResponse<OrganizationHierarchyDto>>;

  // ========== 알림 전송 메서드 ==========
  /**
   * 알림 전송
   *
   * @param entityId - 문서/콘텐츠 ID (각 섹션의 문서 ID)
   * @param request - 알림 전송 요청 데이터
   */
  알림을_전송_한다: (
    entityId: string,
    request: NotificationRequestDto,
  ) => Promise<ApiResponse<NotificationResponseDto>>;
}
