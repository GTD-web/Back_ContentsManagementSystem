import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

// ========== 비디오 갤러리 문서 DTO ==========
export class VideoGalleryDto {
  @ApiProperty({ description: '비디오 갤러리 ID' })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({ description: '제목' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: '공개 여부' })
  @IsBoolean()
  isPublic!: boolean;

  @ApiPropertyOptional({ description: '카테고리' })
  @IsOptional()
  category?: any;

  @ApiProperty({ description: '생성일' })
  @IsDate()
  @Type(() => Date)
  createdAt!: Date;
}

export class CreateVideoGalleryDto {
  @ApiProperty({ description: '제목' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: '공개 여부' })
  @IsBoolean()
  isPublic!: boolean;

  @ApiPropertyOptional({ description: '카테고리 ID' })
  @IsString()
  @IsOptional()
  categoryId?: string;
}

export class UpdateVideoGalleryDto {
  @ApiPropertyOptional({ description: '제목' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: '공개 여부' })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}

// ========== 카테고리 DTO ==========
export class VideoGalleryCategoryDto {
  @ApiProperty({ description: '카테고리 ID' })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({ description: '카테고리 이름' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class CreateVideoGalleryCategoryDto {
  @ApiProperty({ description: '카테고리 이름' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class UpdateVideoGalleryCategoryDto {
  @ApiPropertyOptional({ description: '카테고리 이름' })
  @IsString()
  @IsOptional()
  name?: string;
}

// ========== 번역 DTO ==========
export class VideoGalleryTranslationDto {
  @ApiProperty({ description: '문서 ID' })
  @IsString()
  @IsNotEmpty()
  documentId!: string;

  @ApiProperty({ description: '언어 ID' })
  @IsString()
  @IsNotEmpty()
  languageId!: string;

  @ApiProperty({ description: '번역된 제목' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: '번역된 내용' })
  @IsString()
  @IsNotEmpty()
  content!: string;
}

export class CreateVideoGalleryTranslationDto {
  @ApiProperty({ description: '문서 ID' })
  @IsString()
  @IsNotEmpty()
  documentId!: string;

  @ApiProperty({ description: '언어 ID' })
  @IsString()
  @IsNotEmpty()
  languageId!: string;

  @ApiProperty({ description: '번역된 제목' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: '번역된 내용' })
  @IsString()
  @IsNotEmpty()
  content!: string;
}

export class UpdateVideoGalleryTranslationDto {
  @ApiPropertyOptional({ description: '번역된 제목' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: '번역된 내용' })
  @IsString()
  @IsOptional()
  content?: string;
}

// ========== 첨부파일 DTO ==========
export class VideoGalleryAttachmentDto {
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

export class CreateVideoGalleryAttachmentDto {
  @ApiProperty({ description: '문서 ID' })
  @IsString()
  @IsNotEmpty()
  documentId!: string;

  @ApiProperty({ description: '언어 ID' })
  @IsString()
  @IsNotEmpty()
  languageId!: string;

  @ApiProperty({ description: '파일명' })
  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @ApiProperty({ description: '파일 URL' })
  @IsString()
  @IsNotEmpty()
  fileUrl!: string;
}

export class UpdateVideoGalleryAttachmentDto {
  @ApiPropertyOptional({ description: '파일명' })
  @IsString()
  @IsOptional()
  fileName?: string;

  @ApiPropertyOptional({ description: '파일 URL' })
  @IsString()
  @IsOptional()
  fileUrl?: string;
}
