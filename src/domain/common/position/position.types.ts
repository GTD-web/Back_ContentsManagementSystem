/**
 * 직책 관련 타입 정의
 */

import type { EmployeeDto } from '../employee/employee.types';

/**
 * 직책 DTO
 */
export interface PositionDto {
  /** 직책 ID */
  id: string;

  /** 직책명 */
  name: string;

  /** 직책 코드 */
  code: string;

  /** 직책 설명 */
  description?: string;

  /** 직책 순서 (높을수록 상위 직책) */
  order: number;

  /** 해당 직책 직원 목록 (상세 조회 시만 포함) */
  employees?: EmployeeDto[];

  /** 활성화 여부 */
  isActive: boolean;

  /** 생성일 */
  createdAt: Date;

  /** 수정일 */
  updatedAt: Date;
}
