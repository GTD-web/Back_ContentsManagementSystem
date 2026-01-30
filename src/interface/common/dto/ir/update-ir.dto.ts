import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

/**
 * IR 카테고리 엔티티 수정 DTO
 */
export class UpdateIRCategoryDto {
  @ApiProperty({ description: '카테고리 이름', example: '실적 자료', required: false })
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
 * IR 카테고리 오더 수정 DTO
 */
export class UpdateIRCategoryOrderDto {
  @ApiProperty({ description: '정렬 순서', example: 1 })
  @IsNumber()
  order: number;
}
