import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdatePageViewDto {
  @ApiProperty({
    description: '체류 시간 (밀리초)',
    example: 5000,
  })
  @IsNumber()
  @Min(0)
  stayDuration: number;
}
