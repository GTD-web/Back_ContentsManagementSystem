import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    description: '사번 (SSO에서 받은 employeeNumber)',
    example: 'EMP001',
    required: true,
  })
  @IsNotEmpty({ message: '사번은 필수입니다.' })
  @IsString({ message: '사번은 문자열이어야 합니다.' })
  @MaxLength(50, { message: '사번은 최대 50자까지 입력할 수 있습니다.' })
  employeeNumber: string;

  @ApiProperty({
    description: '관리자 이름',
    example: '홍길동',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '이름은 문자열이어야 합니다.' })
  @MaxLength(200, { message: '이름은 최대 200자까지 입력할 수 있습니다.' })
  name?: string;

  @ApiProperty({
    description: '관리자 이메일',
    example: 'hong@example.com',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '이메일은 문자열이어야 합니다.' })
  @MaxLength(200, { message: '이메일은 최대 200자까지 입력할 수 있습니다.' })
  email?: string;

  @ApiProperty({
    description: '비고',
    example: 'CMS 백엔드 관리자',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '비고는 문자열이어야 합니다.' })
  notes?: string;
}
