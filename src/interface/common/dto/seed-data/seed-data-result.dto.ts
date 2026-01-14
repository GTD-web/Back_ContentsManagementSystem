import { ApiProperty } from '@nestjs/swagger';

/**
 * 시드 데이터 생성 결과 DTO
 */
export class SeedDataResultDto {
  @ApiProperty({
    description: '성공 여부',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: '메시지',
    example: '시드 데이터가 성공적으로 생성되었습니다.',
  })
  message: string;

  @ApiProperty({
    description: '생성 결과 상세',
    example: {
      languages: 4,
      announcements: 10,
      news: 10,
      brochures: 5,
      categories: 5,
    },
  })
  results: Record<string, number>;

  @ApiProperty({
    description: '총 소요 시간 (밀리초)',
    example: 1523,
  })
  totalDuration: number;
}
