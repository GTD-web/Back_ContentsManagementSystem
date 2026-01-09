import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ContentStatus } from '@domain/core/content-status.types';

/**
 * 브로슈어 첨부파일 DTO (응답용)
 */
export class BrochureAttachmentDto {
  @ApiProperty({ description: '파일명', example: 'brochure_ko.pdf' })
  @IsString()
  fileName: string;

  @ApiProperty({
    description: '파일 URL',
    example: 'https://s3.amazonaws.com/...',
  })
  @IsString()
  fileUrl: string;

  @ApiProperty({ description: '파일 크기 (bytes)', example: 1024000 })
  @IsNumber()
  fileSize: number;

  @ApiProperty({ description: 'MIME 타입', example: 'application/pdf' })
  @IsString()
  mimeType: string;
}

/**
 * 브로슈어 생성 DTO
 */
export class CreateBrochureDto {
  @ApiProperty({
    description: '언어 ID',
    example: 'uuid-ko',
  })
  @IsString()
  languageId: string;

  @ApiProperty({
    description: '제목',
    example: '회사 소개 브로슈어',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: '설명',
    example: '루미르 회사 소개 자료입니다.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '생성자 ID', required: false })
  @IsOptional()
  @IsString()
  createdBy?: string;
}
