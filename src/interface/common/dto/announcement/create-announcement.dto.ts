import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSurveyWithoutAnnouncementDto } from '../survey/create-survey.dto';

/**
 * 공지사항 첨부파일 DTO
 */
export class AnnouncementAttachmentDto {
  @ApiProperty({ description: '파일명', example: 'announcement.pdf' })
  @IsString()
  fileName: string;

  @ApiProperty({
    description: '파일 URL',
    example: 'https://s3.amazonaws.com/...',
  })
  @IsString()
  fileUrl: string;

  @ApiProperty({ description: '파일 크기 (bytes)', example: 1024000 })
  fileSize: number;

  @ApiProperty({ description: 'MIME 타입', example: 'application/pdf' })
  @IsString()
  mimeType: string;
}

/**
 * 공지사항 생성 DTO
 */
export class CreateAnnouncementDto {
  @ApiProperty({ description: '제목', example: '2024년 신년 인사' })
  @IsString()
  title: string;

  @ApiProperty({
    description: '내용',
    example: '새해 복 많이 받으세요.',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: '상단 고정 여부',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isFixed?: boolean;

  @ApiProperty({
    description: '공개 여부 (true=전사공개, false=제한공개)',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({
    description: '공개 시작 일시',
    example: '2024-01-01T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  releasedAt?: string;

  @ApiProperty({
    description: '공개 종료 일시',
    example: '2024-12-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  expiredAt?: string;

  @ApiProperty({
    description: '필독 여부',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  mustRead?: boolean;

  @ApiProperty({
    description: '특정 직원 ID 목록 (SSO)',
    type: [String],
    example: ['uuid-1', 'uuid-2'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionEmployeeIds?: string[];

  @ApiProperty({
    description: '직급 코드 목록',
    type: [String],
    example: ['매니저', '책임매니저'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionRankCodes?: string[];

  @ApiProperty({
    description: '직책 코드 목록',
    type: [String],
    example: ['팀장', '파트장'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionPositionCodes?: string[];

  @ApiProperty({
    description: '부서 코드 목록',
    type: [String],
    example: ['경영지원-경지', '연구-시스템'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionDepartmentCodes?: string[];

  @ApiProperty({
    description: '첨부파일 목록',
    type: [AnnouncementAttachmentDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnnouncementAttachmentDto)
  attachments?: AnnouncementAttachmentDto[];

  @ApiProperty({ description: '생성자 ID', required: false })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiProperty({
    description: '설문조사 정보',
    type: CreateSurveyWithoutAnnouncementDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateSurveyWithoutAnnouncementDto)
  survey?: CreateSurveyWithoutAnnouncementDto;
}
