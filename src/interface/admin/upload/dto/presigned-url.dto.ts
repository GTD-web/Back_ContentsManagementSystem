import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 단일 파일 Presigned URL 요청 항목
 */
export class PresignedUrlFileItemDto {
  @ApiProperty({
    description: '원본 파일명',
    example: '회의록.pdf',
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({
    description: '파일 MIME 타입',
    example: 'application/pdf',
  })
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiPropertyOptional({
    description: '파일 크기 (바이트)',
    example: 1024000,
  })
  @IsOptional()
  @IsNumber()
  fileSize?: number;
}

/**
 * Presigned URL 생성 요청 DTO
 */
export class GeneratePresignedUrlDto {
  @ApiProperty({
    description: '업로드할 파일 목록',
    type: [PresignedUrlFileItemDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PresignedUrlFileItemDto)
  files: PresignedUrlFileItemDto[];

  @ApiPropertyOptional({
    description:
      '(더 이상 사용되지 않음) 모든 파일은 temp/ 폴더에 업로드됩니다. ' +
      '실제 제출(위키/공지사항/설문 등) 시 자동으로 보관용 폴더로 이동됩니다.',
    example: 'temp',
    default: 'temp',
    deprecated: true,
  })
  @IsOptional()
  @IsString()
  folder?: string;
}

/**
 * Presigned URL 생성 응답 항목
 */
export class PresignedUrlResponseItemDto {
  @ApiProperty({
    description: '원본 파일명',
    example: '회의록.pdf',
  })
  fileName: string;

  @ApiProperty({
    description: '파일 MIME 타입',
    example: 'application/pdf',
  })
  mimeType: string;

  @ApiProperty({
    description: 'S3에 PUT 업로드할 Presigned URL',
    example: 'https://bucket.s3.ap-northeast-2.amazonaws.com/...',
  })
  presignedUrl: string;

  @ApiProperty({
    description:
      '업로드 완료 후 파일에 접근할 수 있는 URL (temp/ 폴더). ' +
      '실제 제출 시 보관용 폴더로 이동되어 URL이 변경됩니다.',
    example: 'https://bucket.s3.ap-northeast-2.amazonaws.com/dev/temp/uuid.pdf',
  })
  fileUrl: string;

  @ApiProperty({
    description: 'S3 파일 키 (temp/ 폴더)',
    example: 'dev/temp/uuid.pdf',
  })
  key: string;
}

/**
 * Presigned URL 생성 응답 DTO
 */
export class GeneratePresignedUrlResponseDto {
  @ApiProperty({
    description: 'Presigned URL 목록',
    type: [PresignedUrlResponseItemDto],
  })
  files: PresignedUrlResponseItemDto[];
}
