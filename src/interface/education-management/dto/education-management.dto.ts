import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsDate,
  IsArray,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// ========== 수강 직원 상태 Enum ==========
export enum AttendeeStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  OVERDUE = 'overdue',
}

// ========== 수강 직원 DTO ==========
export class AttendeeDto {
  @ApiProperty({ description: '직원 ID' })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({ description: '직원 이름' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: '상태', enum: AttendeeStatus })
  @IsEnum(AttendeeStatus)
  status!: AttendeeStatus;

  @ApiPropertyOptional({ description: '완료 일시' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  completedAt?: Date;

  @ApiProperty({ description: '마감 일시' })
  @IsDate()
  @Type(() => Date)
  deadline!: Date;
}

// ========== 교육 관리 DTO ==========
export class EducationManagementDto {
  @ApiProperty({ description: '교육 관리 ID' })
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

  @ApiProperty({ description: '마감 일시' })
  @IsDate()
  @Type(() => Date)
  deadline!: Date;

  @ApiProperty({ description: '수강자 목록', type: [AttendeeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendeeDto)
  attendees!: AttendeeDto[];

  @ApiPropertyOptional({ description: '첨부파일 목록', type: [String] })
  @IsArray()
  @IsOptional()
  attachments?: string[];

  @ApiPropertyOptional({ description: '관리자' })
  @IsOptional()
  manager?: any;

  @ApiProperty({ description: '생성일' })
  @IsDate()
  @Type(() => Date)
  createdAt!: Date;
}

export class CreateEducationManagementDto {
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

  @ApiProperty({ description: '마감 일시' })
  @IsDate()
  @Type(() => Date)
  deadline!: Date;

  @ApiPropertyOptional({ description: '수강자 ID 목록', type: [String] })
  @IsArray()
  @IsOptional()
  attendeeIds?: string[];
}

export class UpdateEducationManagementDto {
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

  @ApiPropertyOptional({ description: '마감 일시' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  deadline?: Date;

  @ApiPropertyOptional({ description: '수강자 ID 목록', type: [String] })
  @IsArray()
  @IsOptional()
  attendeeIds?: string[];
}

// ========== 수강자 상태 업데이트 DTO ==========
export class UpdateAttendeeStatusDto {
  @ApiProperty({ description: '상태', enum: AttendeeStatus })
  @IsEnum(AttendeeStatus)
  status!: AttendeeStatus;
}

// ========== 첨부파일 DTO ==========
export class EducationManagementAttachmentDto {
  @ApiProperty({ description: '첨부파일 ID' })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({ description: '파일명' })
  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @ApiProperty({ description: '파일 URL' })
  @IsString()
  @IsNotEmpty()
  fileUrl!: string;
}

export class CreateEducationManagementAttachmentDto {
  @ApiProperty({ description: '교육 ID' })
  @IsString()
  @IsNotEmpty()
  educationId!: string;

  @ApiProperty({ description: '파일명' })
  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @ApiProperty({ description: '파일 URL' })
  @IsString()
  @IsNotEmpty()
  fileUrl!: string;
}

export class UpdateEducationManagementAttachmentDto {
  @ApiPropertyOptional({ description: '파일명' })
  @IsString()
  @IsOptional()
  fileName?: string;

  @ApiPropertyOptional({ description: '파일 URL' })
  @IsString()
  @IsOptional()
  fileUrl?: string;
}
