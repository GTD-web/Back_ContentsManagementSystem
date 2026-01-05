/**
 * 직급 관련 타입 정의
 */

import type { EmployeeDto } from '../employee/employee.types';

/**
 * 직급 DTO
 */
export interface RankDto {
  /** 직급 ID */
  id: string;

  /** 직급명 */
  name: string;

  /** 직급 코드 */
  code: string;

  /** 직급 설명 */
  description?: string;

  /** 직급 순서 (높을수록 상위 직급) */
  order: number;

  /** 해당 직급 직원 목록 (상세 조회 시만 포함) */
  employees?: EmployeeDto[];

  /** 활성화 여부 */
  isActive: boolean;

  /** 생성일 */
  createdAt: Date;

  /** 수정일 */
  updatedAt: Date;
}
