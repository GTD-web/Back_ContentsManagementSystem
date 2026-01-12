import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 전자공시 첨부파일 DTO
 */
export class ElectronicDisclosureAttachmentDto {
  @ApiProperty({ description: '파일명', example: 'disclosure_ko.pdf' })
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
 * 전자공시 번역 생성 DTO
 */
export class CreateElectronicDisclosureTranslationDto {
  @ApiProperty({
    description: '언어 ID',
    example: 'uuid-ko',
  })
  @IsString()
  languageId: string;

  @ApiProperty({
    description: '제목',
    example: '2024년 1분기 실적 공시',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: '설명',
    example: '2024년 1분기 실적 공시 자료입니다.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

/**
 * 전자공시 생성 DTO
 */
export class CreateElectronicDisclosureDto {
  @ApiProperty({
    description: '번역 목록 (여러 언어 동시 설정 가능)',
    type: [CreateElectronicDisclosureTranslationDto],
    example: [
      {
        languageId: 'uuid-ko',
        title: '2024년 1분기 실적 공시',
        description: '2024년 1분기 실적 공시 자료입니다.',
      },
      {
        languageId: 'uuid-en',
        title: 'Q1 2024 Earnings Disclosure',
        description: 'Q1 2024 earnings disclosure material.',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateElectronicDisclosureTranslationDto)
  translations: CreateElectronicDisclosureTranslationDto[];

  @ApiProperty({ description: '생성자 ID', required: false })
  @IsOptional()
  @IsString()
  createdBy?: string;
}
