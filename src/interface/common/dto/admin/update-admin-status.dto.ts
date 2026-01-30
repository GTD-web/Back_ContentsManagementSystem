import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateAdminStatusDto {
  @ApiProperty({
    description: '활성화 여부',
    example: true,
    required: true,
  })
  @IsNotEmpty({ message: '활성화 여부는 필수입니다.' })
  @IsBoolean({ message: '활성화 여부는 boolean 값이어야 합니다.' })
  isActive: boolean;
}
