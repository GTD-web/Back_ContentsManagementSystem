import { ApiProperty } from '@nestjs/swagger';

/**
 * 직원 정보 응답 DTO
 */
export class EmployeeResponseDto {
  @ApiProperty({ description: '직원 ID' })
  id: string;

  @ApiProperty({ description: '사번', example: '20028' })
  employeeNumber: string;

  @ApiProperty({ description: '이름', example: '홍길동' })
  name: string;

  @ApiProperty({ description: '이메일', example: 'hong@lumir.space' })
  email: string;

  @ApiProperty({ description: '전화번호', example: '010-1234-5678' })
  phoneNumber: string;

  @ApiProperty({ description: '직책 ID' })
  positionId: string;

  @ApiProperty({ description: '직책명', example: '팀장' })
  positionTitle: string;

  @ApiProperty({ description: '직급 ID' })
  rankId: string;

  @ApiProperty({ description: '직급명', example: '책임매니저' })
  rankName: string;

  @ApiProperty({ description: '관리자 여부', example: true })
  isManager: boolean;

  @ApiProperty({
    description: '메타데이터',
    required: false,
    nullable: true,
  })
  metadata: any | null;
}

/**
 * 부서 정보 응답 DTO
 */
export class DepartmentResponseDto {
  @ApiProperty({ description: '부서 ID' })
  id: string;

  @ApiProperty({ description: '부서명', example: '경영지원실' })
  departmentName: string;

  @ApiProperty({ description: '부서 코드', example: '경영지원-경지' })
  departmentCode: string;

  @ApiProperty({ description: '유형', example: 'DEPARTMENT' })
  type: string;

  @ApiProperty({
    description: '상위 부서 ID',
    required: false,
    nullable: true,
  })
  parentDepartmentId: string | null;

  @ApiProperty({ description: '순서', example: 0 })
  order: number;

  @ApiProperty({ description: '활성화 여부', example: true })
  isActive: boolean;

  @ApiProperty({ description: '예외 여부', example: false })
  isException: boolean;

  @ApiProperty({
    description: '직원 목록',
    type: [EmployeeResponseDto],
    required: false,
  })
  employees?: EmployeeResponseDto[];

  @ApiProperty({
    description: '하위 부서 목록',
    type: [DepartmentResponseDto],
    required: false,
  })
  childDepartments?: DepartmentResponseDto[];

  @ApiProperty({ description: '생성일시', required: false })
  createdAt?: Date;

  @ApiProperty({ description: '수정일시', required: false })
  updatedAt?: Date;
}

/**
 * 조직 정보 응답 DTO
 */
export class OrganizationInfoResponseDto {
  @ApiProperty({
    description: '부서 목록 (트리 구조)',
    type: [DepartmentResponseDto],
  })
  departments: DepartmentResponseDto[];
}

/**
 * 부서 목록 응답 DTO
 */
export class DepartmentListResponseDto {
  @ApiProperty({
    description: '부서 목록',
    type: [DepartmentResponseDto],
  })
  departments: DepartmentResponseDto[];
}

/**
 * 직급 정보 응답 DTO
 */
export class RankResponseDto {
  @ApiProperty({ description: '직급 ID' })
  id: string;

  @ApiProperty({ description: '직급명', example: '책임매니저' })
  rankName: string;

  @ApiProperty({ description: '직급 코드', example: '책임매니저' })
  rankCode: string;

  @ApiProperty({ description: '레벨', example: 7 })
  level: number;
}

/**
 * 직급 목록 응답 DTO
 */
export class RankListResponseDto {
  @ApiProperty({
    description: '직급 목록',
    type: [RankResponseDto],
  })
  items: RankResponseDto[];

  @ApiProperty({ description: '총 개수', example: 15 })
  total: number;
}

/**
 * 직책 정보 응답 DTO
 */
export class PositionResponseDto {
  @ApiProperty({ description: '직책 ID' })
  id: string;

  @ApiProperty({ description: '직책명', example: '팀장' })
  positionTitle: string;

  @ApiProperty({ description: '직책 코드', example: '팀장' })
  positionCode: string;

  @ApiProperty({ description: '레벨', example: 4 })
  level: number;

  @ApiProperty({ description: '관리 권한 여부', example: true })
  hasManagementAuthority: boolean;
}

/**
 * 직책 목록 응답 DTO
 */
export class PositionListResponseDto {
  @ApiProperty({
    description: '직책 목록',
    type: [PositionResponseDto],
  })
  items: PositionResponseDto[];

  @ApiProperty({ description: '총 개수', example: 6 })
  total: number;
}
