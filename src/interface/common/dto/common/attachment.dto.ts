import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

/**
 * 공통 첨부파일 DTO
 *
 * 프론트엔드에서 S3에 직접 업로드한 후 파일 메타데이터를 전달할 때 사용합니다.
 * Presigned URL 방식으로 전환된 모든 도메인에서 공통으로 사용됩니다.
 */
export class AttachmentDto {
  @ApiProperty({
    description: '원본 파일명',
    example: '회의록.pdf',
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({
    description: 'S3 파일 URL (presigned URL 생성 시 반환된 fileUrl)',
    example:
      'https://bucket.s3.ap-northeast-2.amazonaws.com/dev/wiki/uuid.pdf',
  })
  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @ApiProperty({
    description: '파일 크기 (바이트)',
    example: 1024000,
  })
  @IsNumber()
  fileSize: number;

  @ApiProperty({
    description: '파일 MIME 타입',
    example: 'application/pdf',
  })
  @IsString()
  @IsNotEmpty()
  mimeType: string;
}
