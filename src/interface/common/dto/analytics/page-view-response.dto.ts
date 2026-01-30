import { ApiProperty } from '@nestjs/swagger';

export class PageViewResponseDto {
  @ApiProperty({
    description: '페이지 조회 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: '세션 ID',
    example: 'session_123456',
  })
  sessionId: string;

  @ApiProperty({
    description: '페이지 이름',
    example: '/admin/dashboard',
  })
  pageName: string;

  @ApiProperty({
    description: '페이지 타이틀',
    example: '대시보드',
    nullable: true,
  })
  title: string | null;

  @ApiProperty({
    description: '입장 시간',
    example: '2025-01-27T10:00:00.000Z',
  })
  enterTime: Date;

  @ApiProperty({
    description: '퇴장 시간',
    example: '2025-01-27T10:05:00.000Z',
    nullable: true,
  })
  exitTime: Date | null;

  @ApiProperty({
    description: '체류 시간 (밀리초)',
    example: 300000,
    nullable: true,
  })
  stayDuration: number | null;

  @ApiProperty({
    description: '생성일시',
    example: '2025-01-27T10:00:00.000Z',
  })
  createdAt: Date;
}

export class RecentPageViewDto {
  @ApiProperty({
    description: '페이지 이름',
    example: '메인 페이지',
  })
  pageName: string;

  @ApiProperty({
    description: '방문 시간',
    example: '2025. 12. 13. 오후 9:11:19',
  })
  visitTime: string;

  @ApiProperty({
    description: '체류 시간 (초)',
    example: 517,
    nullable: true,
  })
  stayDurationSeconds: number | null;

  @ApiProperty({
    description: '카테고리',
    example: '서비스 | 루미르',
  })
  category: string;
}

export class PageVisitCountDto {
  @ApiProperty({
    description: '페이지 이름',
    example: '메인 페이지',
  })
  pageName: string;

  @ApiProperty({
    description: '방문 횟수',
    example: 13330,
  })
  count: number;
}

export class HourlyVisitDto {
  @ApiProperty({
    description: '시간대 (0-23)',
    example: 14,
  })
  hour: number;

  @ApiProperty({
    description: '방문 횟수',
    example: 1234,
  })
  count: number;
}

export class AnalyticsDashboardDto {
  @ApiProperty({
    description: '총 방문 기록 (30일)',
    example: 9028,
  })
  totalVisits: number;

  @ApiProperty({
    description: '총 방문자 수 (30일) - 중복을 제외한 세션 수',
    example: 2974,
  })
  totalVisitors: number;

  @ApiProperty({
    description: '최근 방문 기록 (20개)',
    type: [RecentPageViewDto],
  })
  recentVisits: RecentPageViewDto[];

  @ApiProperty({
    description: '페이지별 방문수',
    type: [PageVisitCountDto],
  })
  pageVisits: PageVisitCountDto[];

  @ApiProperty({
    description: '시간대별 방문 현황 (24시간)',
    type: [HourlyVisitDto],
  })
  hourlyVisits: HourlyVisitDto[];
}
