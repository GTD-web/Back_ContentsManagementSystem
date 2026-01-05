import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsDate,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// ========== 파일 시스템 타입 Enum ==========
export enum WikiFileSystemType {
  FOLDER = 'folder',
  FILE = 'file',
}

// ========== 파일 시스템 DTO ==========
export class WikiFileSystemDto {
  @ApiProperty({ description: '파일 시스템 ID' })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({ description: '이름' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: '타입', enum: WikiFileSystemType })
  @IsEnum(WikiFileSystemType)
  type!: WikiFileSystemType;

  @ApiPropertyOptional({ description: '부모 ID' })
  @IsString()
  @IsOptional()
  parentId?: string | null;

  @ApiPropertyOptional({ description: '자식 항목들', type: [WikiFileSystemDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => WikiFileSystemDto)
  children?: WikiFileSystemDto[];

  @ApiProperty({ description: '수정일' })
  @IsDate()
  @Type(() => Date)
  updatedAt!: Date;

  @ApiProperty({ description: '생성일' })
  @IsDate()
  @Type(() => Date)
  createdAt!: Date;

  @ApiProperty({ description: '공개 여부' })
  @IsBoolean()
  visibility!: boolean;

  @ApiProperty({ description: '소유자 ID' })
  @IsString()
  @IsNotEmpty()
  ownerId!: string;
}

// ========== Wiki 문서 DTO ==========
export class WikiDto {
  @ApiProperty({ description: 'Wiki ID' })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({ description: '제목' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: '내용' })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({ description: '공개 여부' })
  @IsBoolean()
  isPublic!: boolean;

  @ApiProperty({ description: '소유자 ID' })
  @IsString()
  @IsNotEmpty()
  ownerId!: string;

  @ApiProperty({ description: '파일 시스템', type: WikiFileSystemDto })
  @ValidateNested()
  @Type(() => WikiFileSystemDto)
  fileSystem!: WikiFileSystemDto;

  @ApiPropertyOptional({ description: '태그 목록', type: [String] })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: '생성일' })
  @IsDate()
  @Type(() => Date)
  createdAt!: Date;

  @ApiProperty({ description: '수정일' })
  @IsDate()
  @Type(() => Date)
  updatedAt!: Date;
}

export class CreateWikiDto {
  @ApiProperty({ description: '제목' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: '내용' })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({ description: '공개 여부' })
  @IsBoolean()
  isPublic!: boolean;

  @ApiProperty({ description: '소유자 ID' })
  @IsString()
  @IsNotEmpty()
  ownerId!: string;

  @ApiProperty({ description: '파일 시스템 ID' })
  @IsString()
  @IsNotEmpty()
  fileSystemId!: string;

  @ApiPropertyOptional({ description: '태그 목록', type: [String] })
  @IsArray()
  @IsOptional()
  tags?: string[];
}

export class UpdateWikiDto {
  @ApiPropertyOptional({ description: '제목' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: '내용' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: '공개 여부' })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiPropertyOptional({ description: '태그 목록', type: [String] })
  @IsArray()
  @IsOptional()
  tags?: string[];
}

// ========== 파일 시스템 생성/수정 DTO ==========
export class CreateWikiFileSystemDto {
  @ApiProperty({ description: '이름' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: '타입', enum: WikiFileSystemType })
  @IsEnum(WikiFileSystemType)
  type!: WikiFileSystemType;

  @ApiPropertyOptional({ description: '부모 ID' })
  @IsString()
  @IsOptional()
  parentId?: string;

  @ApiProperty({ description: '공개 여부' })
  @IsBoolean()
  visibility!: boolean;

  @ApiProperty({ description: '소유자 ID' })
  @IsString()
  @IsNotEmpty()
  ownerId!: string;
}

export class UpdateWikiFileSystemDto {
  @ApiPropertyOptional({ description: '이름' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: '공개 여부' })
  @IsBoolean()
  @IsOptional()
  visibility?: boolean;

  @ApiPropertyOptional({ description: '부모 ID' })
  @IsString()
  @IsOptional()
  parentId?: string;
}
