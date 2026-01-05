import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsEnum,
  IsObject,
} from 'class-validator';
import { NotificationTargetType } from '@domain/common/notification';

/**
 * 알림 전송 요청 DTO
 */
export class SendNotificationDto {
  @ApiProperty({
    description: '대상자 타입',
    enum: NotificationTargetType,
    example: NotificationTargetType.DEPARTMENT,
  })
  @IsNotEmpty()
  @IsEnum(NotificationTargetType)
  targetType: NotificationTargetType;

  @ApiProperty({
    description: '대상자 ID 목록 (targetType이 ALL인 경우 빈 배열)',
    type: [String],
    example: ['dept-001', 'dept-002'],
  })
  @IsArray()
  @IsString({ each: true })
  targetIds: string[];

  @ApiProperty({
    description: '알림 제목',
    example: '신규 공지사항이 등록되었습니다',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: '알림 내용',
    example: '2024년 1월 신규 복지 제도 안내를 확인해주세요.',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: '알림 URL (선택사항)',
    example: 'https://cms.example.com/announcements/123',
  })
  @IsOptional()
  @IsString()
  url?: string;
}

/**
 * 알림 전송 응답 DTO
 */
export class NotificationResponseDto {
  @ApiProperty({ description: '전송된 알림 ID' })
  notificationId: string;

  @ApiProperty({ description: '전송된 대상자 수' })
  sentCount: number;

  @ApiProperty({ description: '전송 실패한 대상자 수' })
  failedCount: number;

  @ApiProperty({ description: '전송 시각' })
  sentAt: Date;

  @ApiPropertyOptional({
    description: '실패한 대상자 ID 목록',
    type: [String],
  })
  failedTargetIds?: string[];

  @ApiPropertyOptional({
    description: '실패 사유',
    type: Object,
  })
  @IsOptional()
  @IsObject()
  failureReasons?: Record<string, string>;
}

/**
 * 조직 하이라키 조회 옵션 DTO
 */
export class GetOrganizationHierarchyDto {
  @ApiPropertyOptional({
    description: '직원 정보 포함 여부',
    type: Boolean,
    default: true,
    example: true,
  })
  @IsOptional()
  includeEmployees?: boolean;
}

/**
 * 직원 응답 DTO (간단 버전)
 */
export class EmployeeBasicResponseDto {
  @ApiProperty({ description: '직원 ID' })
  id: string;

  @ApiProperty({ description: '직원 이름' })
  name: string;

  @ApiProperty({ description: '이메일' })
  email: string;

  @ApiProperty({ description: '부서명' })
  departmentName: string;

  @ApiProperty({ description: '직책명' })
  positionName: string;

  @ApiProperty({ description: '직급명' })
  rankName: string;
}

/**
 * 부서 응답 DTO (간단 버전)
 */
export class DepartmentBasicResponseDto {
  @ApiProperty({ description: '부서 ID' })
  id: string;

  @ApiProperty({ description: '부서명' })
  name: string;

  @ApiProperty({ description: '부서 코드' })
  code: string;

  @ApiPropertyOptional({ description: '상위 부서 ID' })
  parentId?: string;

  @ApiProperty({ description: '부서 깊이' })
  depth: number;
}

/**
 * 직책 응답 DTO
 */
export class PositionResponseDto {
  @ApiProperty({ description: '직책 ID' })
  id: string;

  @ApiProperty({ description: '직책명' })
  name: string;

  @ApiProperty({ description: '직책 코드' })
  code: string;

  @ApiPropertyOptional({ description: '직책 설명' })
  description?: string;

  @ApiProperty({ description: '직책 순서' })
  order: number;

  @ApiProperty({ description: '활성화 여부' })
  isActive: boolean;

  @ApiPropertyOptional({
    description: '해당 직책 직원 목록',
    type: [EmployeeBasicResponseDto],
  })
  employees?: EmployeeBasicResponseDto[];
}

/**
 * 직급 응답 DTO
 */
export class RankResponseDto {
  @ApiProperty({ description: '직급 ID' })
  id: string;

  @ApiProperty({ description: '직급명' })
  name: string;

  @ApiProperty({ description: '직급 코드' })
  code: string;

  @ApiPropertyOptional({ description: '직급 설명' })
  description?: string;

  @ApiProperty({ description: '직급 순서' })
  order: number;

  @ApiProperty({ description: '활성화 여부' })
  isActive: boolean;

  @ApiPropertyOptional({
    description: '해당 직급 직원 목록',
    type: [EmployeeBasicResponseDto],
  })
  employees?: EmployeeBasicResponseDto[];
}

/**
 * 조직 하이라키 노드 응답 DTO
 */
export class OrganizationNodeResponseDto {
  @ApiProperty({ description: '부서 정보', type: DepartmentBasicResponseDto })
  department: DepartmentBasicResponseDto;

  @ApiProperty({
    description: '소속 직원 목록',
    type: [EmployeeBasicResponseDto],
  })
  employees: EmployeeBasicResponseDto[];

  @ApiProperty({
    description: '자식 부서 노드',
    type: [OrganizationNodeResponseDto],
  })
  children: OrganizationNodeResponseDto[];

  @ApiProperty({ description: '부서 깊이' })
  depth: number;
}

/**
 * 조직 하이라키 응답 DTO
 */
export class OrganizationHierarchyResponseDto {
  @ApiProperty({
    description: '최상위 조직 노드',
    type: OrganizationNodeResponseDto,
  })
  root: OrganizationNodeResponseDto;

  @ApiProperty({ description: '전체 부서 수' })
  totalDepartments: number;

  @ApiProperty({ description: '전체 직원 수' })
  totalEmployees: number;

  @ApiProperty({ description: '최대 깊이' })
  maxDepth: number;

  @ApiProperty({ description: '조회 시각' })
  fetchedAt: Date;
}
