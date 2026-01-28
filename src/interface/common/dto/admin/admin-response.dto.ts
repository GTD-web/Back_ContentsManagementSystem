import { ApiProperty } from '@nestjs/swagger';

export class AdminResponseDto {
  @ApiProperty({
    description: 'Admin ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: '사번',
    example: 'EMP001',
  })
  employeeNumber: string;

  @ApiProperty({
    description: '관리자 이름',
    example: '홍길동',
    nullable: true,
  })
  name: string | null;

  @ApiProperty({
    description: '관리자 이메일',
    example: 'hong@example.com',
    nullable: true,
  })
  email: string | null;

  @ApiProperty({
    description: '활성화 여부',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: '비고',
    example: 'CMS 백엔드 관리자',
    nullable: true,
  })
  notes: string | null;

  @ApiProperty({
    description: '생성 일시',
    example: '2026-01-28T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정 일시',
    example: '2026-01-28T10:00:00.000Z',
  })
  updatedAt: Date;
}
