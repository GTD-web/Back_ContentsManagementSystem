/**
 * 조직 하이라키 타입 정의
 */

import type { DepartmentDto } from '../department/department.types';
import type { EmployeeDto } from '../employee/employee.types';

/**
 * 조직 하이라키 노드
 */
export interface OrganizationNode {
  /** 부서 정보 */
  department: DepartmentDto;

  /** 소속 직원 목록 */
  employees: EmployeeDto[];

  /** 자식 부서 노드 */
  children: OrganizationNode[];

  /** 부서 깊이 (루트는 0) */
  depth: number;
}

/**
 * 조직 하이라키 DTO
 */
export interface OrganizationHierarchyDto {
  /** 최상위 조직 노드 */
  root: OrganizationNode;

  /** 전체 부서 수 */
  totalDepartments: number;

  /** 전체 직원 수 */
  totalEmployees: number;

  /** 최대 깊이 */
  maxDepth: number;

  /** 조회 시각 */
  fetchedAt: Date;
}
