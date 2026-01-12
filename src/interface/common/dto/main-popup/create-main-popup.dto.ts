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
 * 메인 팝업 첨부파일 DTO
 */
export class MainPopupAttachmentDto {
  @ApiProperty({ description: '파일명', example: 'popup_image.jpg' })
  @IsString()
  fileName: string;

  @ApiProperty({
    description: '파일 URL',
    example: 'https://s3.amazonaws.com/...',
  })
  @IsString()
  fileUrl: string;

  @ApiProperty({ description: '파일 크기 (bytes)', example: 512000 })
  @IsNumber()
  fileSize: number;

  @ApiProperty({ description: 'MIME 타입', example: 'image/jpeg' })
  @IsString()
  mimeType: string;
}

/**
 * 메인 팝업 번역 생성 DTO
 */
export class CreateMainPopupTranslationDto {
  @ApiProperty({
    description: '언어 ID',
    example: 'uuid-ko',
  })
  @IsString()
  languageId: string;

  @ApiProperty({
    description: '제목',
    example: '신제품 출시 안내',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: '설명',
    example: '새로운 제품이 출시되었습니다.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

/**
 * 메인 팝업 생성 DTO
 */
export class CreateMainPopupDto {
  @ApiProperty({
    description: '번역 목록 (여러 언어 동시 설정 가능)',
    type: [CreateMainPopupTranslationDto],
    example: [
      {
        languageId: 'uuid-ko',
        title: '신제품 출시 안내',
        description: '새로운 제품이 출시되었습니다.',
      },
      {
        languageId: 'uuid-en',
        title: 'New Product Launch',
        description: 'A new product has been launched.',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMainPopupTranslationDto)
  translations: CreateMainPopupTranslationDto[];

  @ApiProperty({ description: '생성자 ID', required: false })
  @IsOptional()
  @IsString()
  createdBy?: string;
}
