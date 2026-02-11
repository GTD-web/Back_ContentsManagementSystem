import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsNumber,
  IsUUID,
  IsEnum,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { WikiFileSystem } from '@domain/sub/wiki-file-system/wiki-file-system.entity';
import { WikiFileSystemType } from '@domain/sub/wiki-file-system/wiki-file-system-type.types';

/**
 * 폴더 생성 DTO
 * 
 * ⚠️ **권한 정책**: 
 * - 기본적으로 전사공개(`isPublic: true`)로 생성됩니다.
 * - `isPublic: false`로 설정하고 권한 필드들을 지정하여 특정 그룹만 접근 가능하도록 제한할 수 있습니다.
 * - 권한 필드: `permissionRankIds`(직급), `permissionPositionIds`(직책), `permissionDepartmentIds`(부서)
 * - 권한 필드를 설정하면 해당 그룹에 속한 사용자만 폴더에 접근할 수 있습니다.
 * 
 * ⚠️ **parentId**: 없으면 최상위 폴더로 생성됩니다 (parentId: null).
 */
export class CreateFolderDto {
  @ApiProperty({ description: '폴더명', example: '회의록' })
  @IsString({ message: 'name은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: 'name은 비어있을 수 없습니다.' })
  @MinLength(1, { message: 'name은 최소 1자 이상이어야 합니다.' })
  name: string;

  @ApiPropertyOptional({
    description: '부모 폴더 ID (없으면 최상위 폴더로 생성)',
    example: 'uuid-of-parent-folder',
  })
  @IsOptional()
  @IsUUID(undefined, { message: 'parentId는 유효한 UUID여야 합니다.' })
  parentId?: string | null;

  @ApiPropertyOptional({
    description: '공개 여부 (기본값: true - 전사공개, false - 권한 기반 제한)',
    example: true,
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'isPublic은 boolean 값이어야 합니다.' })
  isPublic?: boolean;

  @ApiPropertyOptional({
    description: '접근 가능한 직급 ID 목록 (UUID) - isPublic: false일 때 사용',
    example: ['a1b2c3d4-e5f6-7890-abcd-ef1234567890'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionRankIds?: string[];

  @ApiPropertyOptional({
    description: '접근 가능한 직책 ID 목록 (UUID) - isPublic: false일 때 사용',
    example: ['c3d4e5f6-a7b8-9012-cdef-123456789012'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionPositionIds?: string[];

  @ApiPropertyOptional({
    description: '접근 가능한 부서 ID 목록 (UUID) - isPublic: false일 때 사용',
    example: ['e2b3b884-833c-4fdb-ba00-ede1a45b8160', 'c11023a2-fb66-4e3f-bfcf-0666fb19f6bf'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionDepartmentIds?: string[];

  @ApiPropertyOptional({ description: '정렬 순서', example: 0, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  order?: number;
}

/**
 * 파일 생성 DTO
 * 
 * ⚠️ parentId: 없으면 최상위에 파일이 생성됩니다 (parentId: null).
 */
export class CreateFileDto {
  @ApiProperty({ description: '파일명', example: '2024년 전사 회의록' })
  @IsString({ message: 'name은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: 'name은 비어있을 수 없습니다.' })
  @MinLength(1, { message: 'name은 최소 1자 이상이어야 합니다.' })
  name: string;

  @ApiPropertyOptional({
    description: '부모 폴더 ID (없으면 최상위에 파일 생성)',
    example: 'uuid-of-parent-folder',
  })
  @IsOptional()
  @IsUUID(undefined, { message: 'parentId는 유효한 UUID여야 합니다.' })
  parentId?: string | null;

  @ApiPropertyOptional({
    description: '문서 제목',
    example: '2024년 1월 전사 회의록',
  })
  @IsOptional()
  @IsString()
  title?: string | null;

  @ApiPropertyOptional({
    description: '문서 본문',
    example: '## 회의 안건\n\n1. 신제품 출시\n2. 예산 검토',
  })
  @IsOptional()
  @IsString()
  content?: string | null;

  @ApiPropertyOptional({
    description: '공개 여부',
    example: true,
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'isPublic은 boolean 값이어야 합니다.' })
  isPublic?: boolean;

  @ApiPropertyOptional({
    description: '직급 ID 목록 (UUID)',
    example: ['a1b2c3d4-e5f6-7890-abcd-ef1234567890'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionRankIds?: string[];

  @ApiPropertyOptional({
    description: '직책 ID 목록 (UUID)',
    example: ['c3d4e5f6-a7b8-9012-cdef-123456789012'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionPositionIds?: string[];

  @ApiPropertyOptional({
    description: '부서 ID 목록 (UUID)',
    example: ['e2b3b884-833c-4fdb-ba00-ede1a45b8160', 'c11023a2-fb66-4e3f-bfcf-0666fb19f6bf'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionDepartmentIds?: string[];

  @ApiPropertyOptional({ description: '정렬 순서', example: 0, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  order?: number;
}

/**
 * 빈 파일 생성 DTO
 * 
 * ⚠️ parentId: 없으면 최상위에 파일이 생성됩니다 (parentId: null).
 */
export class CreateEmptyFileDto {
  @ApiProperty({ description: '파일명', example: '새 문서' })
  @IsString({ message: 'name은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: 'name은 비어있을 수 없습니다.' })
  @MinLength(1, { message: 'name은 최소 1자 이상이어야 합니다.' })
  name: string;

  @ApiPropertyOptional({
    description: '부모 폴더 ID (없으면 최상위에 파일 생성)',
    example: 'uuid-of-parent-folder',
  })
  @IsOptional()
  @IsUUID(undefined, { message: 'parentId는 유효한 UUID여야 합니다.' })
  parentId?: string | null;

  @ApiPropertyOptional({
    description: '공개 여부 (기본값: true - 상위 폴더 권한 cascading, false - 완전 비공개)',
    example: true,
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'isPublic은 boolean 값이어야 합니다.' })
  isPublic?: boolean;

  @ApiPropertyOptional({
    description: '직급 ID 목록 (UUID)',
    example: ['a1b2c3d4-e5f6-7890-abcd-ef1234567890'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionRankIds?: string[];

  @ApiPropertyOptional({
    description: '직책 ID 목록 (UUID)',
    example: ['c3d4e5f6-a7b8-9012-cdef-123456789012'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionPositionIds?: string[];

  @ApiPropertyOptional({
    description: '부서 ID 목록 (UUID)',
    example: ['e2b3b884-833c-4fdb-ba00-ede1a45b8160', 'c11023a2-fb66-4e3f-bfcf-0666fb19f6bf'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionDepartmentIds?: string[];
}

/**
 * 폴더 수정 DTO
 */
export class UpdateFolderDto {
  @ApiPropertyOptional({ description: '폴더명', example: '회의록' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: '공개 여부',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({
    description: '직급 ID 목록 (UUID)',
    example: ['a1b2c3d4-e5f6-7890-abcd-ef1234567890'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionRankIds?: string[];

  @ApiPropertyOptional({
    description: '직책 ID 목록 (UUID)',
    example: ['c3d4e5f6-a7b8-9012-cdef-123456789012'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionPositionIds?: string[];

  @ApiPropertyOptional({
    description: '부서 ID 목록 (UUID)',
    example: ['e2b3b884-833c-4fdb-ba00-ede1a45b8160', 'c11023a2-fb66-4e3f-bfcf-0666fb19f6bf'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionDepartmentIds?: string[];

  @ApiPropertyOptional({ description: '정렬 순서', example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  order?: number;
}

/**
 * 폴더 이름 수정 DTO
 */
export class UpdateFolderNameDto {
  @ApiProperty({ description: '폴더명', example: '회의록' })
  @IsString()
  name: string;
}

/**
 * 파일 수정 DTO
 */
export class UpdateFileDto {
  @ApiProperty({ description: '파일명', example: '2024년 전사 회의록' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: '문서 제목',
    example: '2024년 1월 전사 회의록',
  })
  @IsOptional()
  @IsString()
  title?: string | null;

  @ApiPropertyOptional({
    description: '문서 본문',
    example: '## 회의 안건\n\n1. 신제품 출시\n2. 예산 검토',
  })
  @IsOptional()
  @IsString()
  content?: string | null;
}

/**
 * Wiki 공개 수정 DTO (폴더 전용)
 */
export class UpdateWikiPublicDto {
  @ApiProperty({ description: '공개 여부', example: true })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isPublic: boolean;

  @ApiPropertyOptional({
    description: '직급 ID 목록 (UUID)',
    example: ['a1b2c3d4-e5f6-7890-abcd-ef1234567890'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionRankIds?: string[];

  @ApiPropertyOptional({
    description: '직책 ID 목록 (UUID)',
    example: ['c3d4e5f6-a7b8-9012-cdef-123456789012'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionPositionIds?: string[];

  @ApiPropertyOptional({
    description: '부서 ID 목록 (UUID)',
    example: ['e2b3b884-833c-4fdb-ba00-ede1a45b8160', 'c11023a2-fb66-4e3f-bfcf-0666fb19f6bf'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionDepartmentIds?: string[];
}

/**
 * 파일 공개 수정 DTO
 */
export class UpdateFilePublicDto {
  @ApiProperty({ 
    description: '공개 여부 (true: 상위 폴더 권한 cascading, false: 완전 비공개)', 
    example: true 
  })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isPublic: boolean;
}

/**
 * Wiki 경로 수정 DTO
 */
export class UpdateWikiPathDto {
  @ApiProperty({
    description: '부모 폴더 ID (null이면 루트로 이동)',
    example: 'uuid-or-null',
  })
  @IsOptional()
  @IsUUID()
  parentId: string | null;
}

/**
 * Wiki 경로 정보 DTO (Breadcrumb)
 */
export class WikiPathDto {
  @ApiProperty({ description: 'ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: '이름', example: '회의록' })
  name: string;

  @ApiProperty({ description: '깊이', example: 0 })
  depth: number;
}

/**
 * Wiki 검색 결과 DTO
 */
export class WikiSearchResultDto {
  @ApiProperty({ description: 'ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: '파일명', example: '2024년 회의록.pdf' })
  name: string;

  @ApiProperty({ description: '타입', enum: ['folder', 'file'], example: 'file' })
  type: string;

  @ApiPropertyOptional({ description: '부모 폴더 ID', example: 'uuid-of-parent-folder' })
  parentId?: string | null;

  @ApiPropertyOptional({ description: '문서 제목', example: '2024년 1월 전사 회의록' })
  title?: string;

  @ApiPropertyOptional({ description: '문서 본문 미리보기', example: '## 회의 안건\n\n1. 신제품...' })
  contentPreview?: string;

  @ApiProperty({
    description: '상위 폴더 경로 상세 (루트부터 순서대로, 파일 자신 제외)',
    type: [WikiPathDto],
    example: [
      { id: 'uuid-root', name: '전사 문서', depth: 0 },
      { id: 'uuid-dept', name: '개발팀', depth: 1 },
    ],
  })
  path: WikiPathDto[];

  @ApiProperty({
    description: '상위 폴더 이름 배열 (루트부터 순서대로, 파일 자신 제외). 예: ["전사 문서", "개발팀", "회의록"]',
    example: ['전사 문서', '개발팀', '회의록'],
    type: [String],
  })
  pathNames: string[];

  @ApiProperty({
    description: '상위 폴더 ID 배열 (루트부터 순서대로, 파일 자신 제외)',
    example: ['uuid-root', 'uuid-dept', 'uuid-folder'],
    type: [String],
  })
  pathIds: string[];

  @ApiProperty({ description: '생성일', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '수정일', example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;

  static from(wiki: WikiFileSystem, ancestors: Array<{ wiki: WikiFileSystem; depth: number }>): WikiSearchResultDto {
    const dto = new WikiSearchResultDto();
    dto.id = wiki.id;
    dto.name = wiki.name;
    dto.type = wiki.type;
    dto.parentId = wiki.parentId;
    dto.title = wiki.title || undefined;
    dto.contentPreview = wiki.content ? wiki.content.substring(0, 200) : undefined;

    // ancestors는 depth DESC (루트=큰 depth → 자신=depth 0)로 정렬되어 있음
    // 파일 자신(depth=0)을 제외한 상위 폴더만 추출
    const parentFolders = ancestors
      .filter(a => a.depth > 0)
      .sort((a, b) => b.depth - a.depth); // 루트(큰 depth)부터 직접 부모(depth=1)까지

    dto.path = parentFolders.map(a => ({
      id: a.wiki.id,
      name: a.wiki.name,
      depth: a.wiki.depth, // 엔티티의 절대 깊이 사용
    }));
    dto.pathNames = parentFolders.map(a => a.wiki.name);
    dto.pathIds = parentFolders.map(a => a.wiki.id);

    dto.createdAt = wiki.createdAt;
    dto.updatedAt = wiki.updatedAt;
    return dto;
  }
}

/**
 * Wiki 검색 목록 응답 DTO
 */
export class WikiSearchListResponseDto {
  @ApiProperty({ description: '검색 결과 목록', type: [WikiSearchResultDto] })
  items: WikiSearchResultDto[];

  @ApiProperty({ description: '전체 개수', example: 10 })
  total: number;
}

/**
 * Wiki 응답 DTO
 */
export class WikiResponseDto {
  @ApiProperty({ description: 'ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: '이름', example: '회의록' })
  name: string;

  @ApiProperty({
    description: '타입',
    enum: WikiFileSystemType,
    example: WikiFileSystemType.FOLDER,
  })
  type: WikiFileSystemType;

  @ApiPropertyOptional({ description: '부모 ID', example: 'uuid' })
  parentId: string | null;

  @ApiProperty({ description: '계층 깊이', example: 0 })
  depth: number;

  @ApiPropertyOptional({ description: '문서 제목', example: '회의록' })
  title: string | null;

  @ApiPropertyOptional({
    description: '문서 본문',
    example: '## 회의 내용\n\n...',
  })
  content: string | null;

  @ApiPropertyOptional({ description: '파일 URL', example: 'https://...' })
  fileUrl: string | null;

  @ApiPropertyOptional({ description: '파일 크기', example: 1024000 })
  fileSize: number | null;

  @ApiPropertyOptional({ description: 'MIME 타입', example: 'application/pdf' })
  mimeType: string | null;

  @ApiPropertyOptional({
    description: '첨부파일 목록',
    example: [
      {
        fileName: 'file.pdf',
        fileUrl: 'https://...',
        fileSize: 1024000,
        mimeType: 'application/pdf',
      },
    ],
  })
  attachments: Array<{
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }> | null;

  @ApiProperty({ description: '공개 여부', example: true })
  isPublic: boolean;

  @ApiPropertyOptional({
    description: '직급 ID 목록 (UUID)',
    example: ['a1b2c3d4-e5f6-7890-abcd-ef1234567890'],
  })
  permissionRankIds: string[] | null;

  @ApiPropertyOptional({
    description: '직책 ID 목록 (UUID)',
    example: ['c3d4e5f6-a7b8-9012-cdef-123456789012'],
  })
  permissionPositionIds: string[] | null;

  @ApiPropertyOptional({
    description: '부서 ID 목록 (UUID)',
    example: ['e2b3b884-833c-4fdb-ba00-ede1a45b8160'],
  })
  permissionDepartmentIds: string[] | null;

  @ApiProperty({ description: '정렬 순서', example: 0 })
  order: number;

  @ApiProperty({ description: '생성 일시' })
  createdAt: Date;

  @ApiProperty({ description: '수정 일시' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: '생성자 ID' })
  createdBy: string | null;

  @ApiPropertyOptional({ description: '생성자 이름' })
  createdByName?: string | null;

  @ApiPropertyOptional({ description: '수정자 ID' })
  updatedBy: string | null;

  @ApiPropertyOptional({ description: '수정자 이름' })
  updatedByName?: string | null;

  @ApiPropertyOptional({
    description: '하위 폴더 및 파일 목록 (폴더인 경우에만)',
    type: [WikiResponseDto],
  })
  children?: WikiResponseDto[];

  @ApiPropertyOptional({
    description: '부모 폴더 이름들의 배열 (루트부터 현재 폴더의 부모까지)',
    example: ['루트', '회의록'],
    type: [String],
  })
  path?: string[];

  @ApiPropertyOptional({
    description: '부모 폴더 ID들의 배열 (루트부터 현재 폴더의 부모까지)',
    example: ['dc7e6bed-bfb1-446c-a964-55ecdec88dc4', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'],
    type: [String],
  })
  pathIds?: string[];

  @ApiPropertyOptional({
    description: '상위 폴더 공개범위 상속 여부. true이면 현재 항목의 공개범위가 아닌 상위 폴더의 공개범위가 적용됨',
    example: false,
  })
  isPermissionInherited?: boolean;

  @ApiPropertyOptional({
    description: '공개범위를 상속받은 상위 폴더 정보 (isPermissionInherited가 true인 경우에만 제공)',
    example: {
      id: 'uuid',
      name: '상위 폴더명',
      isPublic: false,
      permissionRankIds: ['uuid'],
      permissionPositionIds: [],
      permissionDepartmentIds: ['uuid'],
    },
  })
  inheritedFrom?: {
    id: string;
    name: string;
    isPublic: boolean;
    permissionRankIds: string[] | null;
    permissionPositionIds: string[] | null;
    permissionDepartmentIds: string[] | null;
  };

  @ApiPropertyOptional({
    description: '대상 직원 정보 (권한 기반으로 계산)',
    example: {
      total: 25,
      employees: [
        {
          employeeNumber: '2021001',
          employeeName: '홍길동',
          departmentId: 'uuid',
          departmentName: '개발팀',
          rankId: 'uuid',
          rankName: '대리',
          positionId: 'uuid',
          positionName: '팀장',
        },
      ],
    },
  })
  recipients?: {
    total: number;
    employees: Array<{
      employeeNumber: string;
      employeeName: string;
      departmentId: string | null;
      departmentName: string;
      rankId?: string | null;
      rankName?: string | null;
      positionId?: string | null;
      positionName?: string | null;
    }>;
  };

  static from(
    wiki: WikiFileSystem, 
    children?: WikiFileSystem[],
    path?: string[],
    pathIds?: string[],
    createdByName?: string | null,
    updatedByName?: string | null,
  ): WikiResponseDto {
    const dto = new WikiResponseDto();
    dto.id = wiki.id;
    dto.name = wiki.name;
    dto.type = wiki.type;
    dto.parentId = wiki.parentId;
    dto.depth = wiki.depth;
    dto.title = wiki.title;
    dto.content = wiki.content;
    dto.fileUrl = wiki.fileUrl;
    dto.fileSize = wiki.fileSize;
    dto.mimeType = wiki.mimeType;
    dto.attachments = wiki.attachments;
    dto.isPublic = wiki.isPublic;
    dto.permissionRankIds = wiki.permissionRankIds;
    dto.permissionPositionIds = wiki.permissionPositionIds;
    dto.permissionDepartmentIds = wiki.permissionDepartmentIds;
    dto.order = wiki.order;
    dto.createdAt = wiki.createdAt;
    dto.updatedAt = wiki.updatedAt;
    dto.createdBy = wiki.createdBy;
    dto.updatedBy = wiki.updatedBy;
    dto.createdByName = createdByName;
    dto.updatedByName = updatedByName;
    
    // 경로 정보 추가
    if (path) {
      dto.path = path;
    }
    if (pathIds) {
      dto.pathIds = pathIds;
    }
    
    // 하위 항목이 있으면 추가
    if (children && children.length > 0) {
      dto.children = children.map((child) => WikiResponseDto.from(child));
    }
    
    return dto;
  }
}

/**
 * Wiki 목록 응답 DTO
 */
export class WikiListResponseDto {
  @ApiProperty({ description: 'Wiki 항목 목록', type: [WikiResponseDto] })
  items: WikiResponseDto[];

  @ApiProperty({ description: '전체 개수', example: 10 })
  total: number;
}

/**
 * Wiki 접근 가능 여부 확인 요청 DTO
 * 
 * 파일/폴더 생성 전에 해당 설정으로 생성했을 때 현재 사용자가 접근 가능한지 미리 확인합니다.
 * 프론트엔드에서 주기적으로 호출하여 경고 UI를 제공하는 데 사용됩니다.
 */
export class CheckWikiAccessDto {
  @ApiPropertyOptional({
    description: '부모 폴더 ID (없으면 최상위 생성으로 간주)',
    example: 'uuid-of-parent-folder',
  })
  @IsOptional()
  @IsUUID(undefined, { message: 'parentId는 유효한 UUID여야 합니다.' })
  parentId?: string | null;

  @ApiProperty({
    description: '생성할 항목 타입 (folder 또는 file)',
    enum: WikiFileSystemType,
    example: WikiFileSystemType.FOLDER,
  })
  @IsEnum(WikiFileSystemType, { message: 'type은 folder 또는 file이어야 합니다.' })
  type: WikiFileSystemType;

  @ApiPropertyOptional({
    description: '공개 여부 (기본값: true)',
    example: true,
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'isPublic은 boolean 값이어야 합니다.' })
  isPublic?: boolean;

  @ApiPropertyOptional({
    description: '접근 가능한 직급 ID 목록 (UUID)',
    example: ['a1b2c3d4-e5f6-7890-abcd-ef1234567890'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionRankIds?: string[];

  @ApiPropertyOptional({
    description: '접근 가능한 직책 ID 목록 (UUID)',
    example: ['c3d4e5f6-a7b8-9012-cdef-123456789012'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionPositionIds?: string[];

  @ApiPropertyOptional({
    description: '접근 가능한 부서 ID 목록 (UUID)',
    example: ['e2b3b884-833c-4fdb-ba00-ede1a45b8160'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionDepartmentIds?: string[];
}

/**
 * Wiki 접근 가능 여부 경고 정보
 */
export class WikiAccessWarningDto {
  @ApiProperty({
    description: '경고 출처 (ancestor: 상위 폴더 권한, self: 생성 항목 자체 권한)',
    enum: ['ancestor', 'self'],
    example: 'ancestor',
  })
  source: 'ancestor' | 'self';

  @ApiProperty({
    description: '접근 제한을 유발하는 폴더 ID (self인 경우 빈 문자열)',
    example: 'uuid-of-blocking-folder',
  })
  folderId: string;

  @ApiProperty({
    description: '접근 제한을 유발하는 폴더 이름 (self인 경우 생성할 항목 설명)',
    example: '경영전략팀 전용',
  })
  folderName: string;

  @ApiProperty({
    description: '해당 폴더의 계층 깊이 (0=루트, self인 경우 -1)',
    example: 2,
  })
  depth: number;

  @ApiProperty({
    description: '경고 사유',
    example: '상위 폴더의 부서 권한에 현재 사용자의 부서가 포함되지 않습니다.',
  })
  reason: string;
}

/**
 * 조상 폴더 경로 정보
 */
export class AncestorPathItemDto {
  @ApiProperty({ description: '폴더 ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: '폴더 이름', example: '회의록' })
  name: string;

  @ApiProperty({ description: '계층 깊이 (0=루트)', example: 0 })
  depth: number;

  @ApiProperty({ description: '해당 폴더의 접근 가능 여부', example: true })
  accessible: boolean;
}

/**
 * Wiki 접근 가능 여부 확인 응답 DTO
 */
export class CheckWikiAccessResponseDto {
  @ApiProperty({
    description: '현재 사용자의 접근 가능 여부 (상위 폴더 체인 + 자체 권한 모두 통과해야 true)',
    example: true,
  })
  accessible: boolean;

  @ApiPropertyOptional({
    description: '접근 불가 시 경고 메시지 요약',
    example: '이 설정으로 생성하면 현재 사용자가 해당 항목에 접근할 수 없습니다.',
  })
  warning?: string;

  @ApiPropertyOptional({
    description: '상위 폴더 경로 (루트 → 직접 상위 폴더 순서, 각 폴더의 접근 가능 여부 포함)',
    type: [AncestorPathItemDto],
    example: [
      { id: 'uuid-root', name: '전사 문서', depth: 0, accessible: true },
      { id: 'uuid-dept', name: '경영전략팀', depth: 1, accessible: false },
      { id: 'uuid-sub', name: '기밀 문서', depth: 2, accessible: false },
    ],
  })
  ancestorPath?: AncestorPathItemDto[];

  @ApiPropertyOptional({
    description: '접근 불가 상세 사유 목록',
    type: [WikiAccessWarningDto],
  })
  details?: WikiAccessWarningDto[];
}
