import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate } from 'class-validator';

export class CreatePageViewDto {
  @ApiProperty({
    description: '세션 ID',
    example: 'session_123456',
  })
  @IsString()
  sessionId: string;

  @ApiProperty({
    description: '페이지 이름',
    example: '/admin/dashboard',
  })
  @IsString()
  pageName: string;

  @ApiProperty({
    description: '페이지 타이틀',
    example: '대시보드',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;
}
