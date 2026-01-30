import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

/**
 * 주주총회 카테고리 엔티티 수정 DTO
 */
export class UpdateShareholdersMeetingCategoryDto {
  @ApiProperty({ description: '카테고리 이름', example: '정기 주주총회', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: '카테고리 설명',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '활성화 여부', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

/**
 * 주주총회 카테고리 오더 수정 DTO
 */
export class UpdateShareholdersMeetingCategoryOrderDto {
  @ApiProperty({ description: '정렬 순서', example: 1 })
  @IsNumber()
  order: number;
}
