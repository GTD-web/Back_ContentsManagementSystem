import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 브로슈어 번역 항목 DTO
 */
export class BrochureTranslationItemDto {
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
}

/**
 * 브로슈어 번역들 수정 DTO
 */
export class UpdateBrochureTranslationsDto {
  @ApiProperty({
    description: '번역 목록',
    type: [BrochureTranslationItemDto],
    example: [
      {
        languageId: 'uuid-ko',
        title: '회사 소개 브로슈어',
        description: '루미르 회사 소개 자료입니다.',
      },
      {
        languageId: 'uuid-en',
        title: 'Company Introduction Brochure',
        description: 'Lumir company introduction material.',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BrochureTranslationItemDto)
  translations: BrochureTranslationItemDto[];
}
