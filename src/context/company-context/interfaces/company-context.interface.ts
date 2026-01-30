/**
 * 조직 정보 인터페이스 (SSO)
 */
export interface OrganizationInfo {
  departments: Department[];
}

/**
 * 부서 정보 인터페이스
 */
export interface Department {
  id: string;
  departmentName: string;
  departmentCode: string;
  type: string;
  parentDepartmentId: string | null;
  order: number;
  isActive: boolean;
  isException: boolean;
  employees?: Employee[];
  childDepartments?: Department[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * 직급 정보 인터페이스
 */
export interface Rank {
  id: string;
  rankName: string;
  rankCode: string;
  level: number;
  isActive?: boolean;
}

/**
 * 직책 정보 인터페이스
 */
export interface Position {
  id: string;
  positionTitle: string;
  positionCode: string;
  level: number;
  hasManagementAuthority: boolean;
  isActive?: boolean;
}

/**
 * 부서 상세 정보 인터페이스 (직원 정보에 포함되는 경우)
 */
export interface DepartmentDetail {
  id: string;
  departmentName: string;
  departmentCode: string;
  type: string;
  parentDepartmentId: string | null;
  order: number;
}

/**
 * 직원 정보 인터페이스
 */
export interface Employee {
  id: string;
  name: string;
  employeeNumber: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: string;
  gender?: string;
  hireDate?: string;
  status?: string;
  // 중첩된 객체로 제공되는 경우
  department?: DepartmentDetail;
  position?: Position;
  rank?: Rank;
  // 직접 필드로 제공되는 경우 (하위 호환성)
  positionId?: string;
  positionTitle?: string;
  positionCode?: string;
  positionLevel?: number;
  rankId?: string;
  rankName?: string;
  rankCode?: string;
  rankLevel?: number;
  isManager?: boolean;
  hasManagementAuthority?: boolean;
  metadata?: any | null;
  departmentId?: string;
  departmentName?: string;
  departmentCode?: string;
  // 추가 필드 (SSO에서 제공할 수 있는 필드들)
  number?: string;
  phone?: string;
  positionName?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

/**
 * 부서 목록 조회 결과
 */
export interface DepartmentListResult {
  departments: Department[];
}

/**
 * 직급 목록 조회 결과
 */
export type RankListResult = Rank[];

/**
 * 직책 목록 조회 결과
 */
export type PositionListResult = Position[];
