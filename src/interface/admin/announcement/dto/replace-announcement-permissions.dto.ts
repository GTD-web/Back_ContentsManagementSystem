import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 권한 ID 매핑 (기존 ID → 새로운 ID)
 */
class PermissionIdMapping {
  @ApiProperty({
    description: '기존 (무효한) ID',
    example: 'DEPT_001',
  })
  @IsString()
  @IsNotEmpty()
  oldId: string;

  @ApiProperty({
    description: '새로운 (유효한) ID',
    example: 'DEPT_002',
  })
  @IsString()
  @IsNotEmpty()
  newId: string;
}

/**
 * 공지사항 권한 ID 교체 DTO
 */
export class ReplaceAnnouncementPermissionsDto {
  @ApiProperty({
    description: '부서 ID 매핑 목록 (기존 → 새로운)',
    type: [PermissionIdMapping],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionIdMapping)
  departments?: PermissionIdMapping[];

  @ApiProperty({
    description: '직원 ID 매핑 목록 (기존 → 새로운)',
    type: [PermissionIdMapping],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionIdMapping)
  employees?: PermissionIdMapping[];

  @ApiProperty({
    description: '처리 메모 (선택)',
    example: '구 마케팅팀을 신 마케팅팀으로 교체',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;
}
