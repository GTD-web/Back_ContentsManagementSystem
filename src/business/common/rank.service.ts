import { Injectable } from '@nestjs/common';
import type { RankDto } from '@domain/common/rank/rank.types';
import {
  successResponse,
  type ApiResponse,
} from '@domain/common/types/api-response.types';

/**
 * 직급 비즈니스 서비스
 *
 * @description
 * - 외부 시스템(EMS-PROD)의 직급 데이터를 조회합니다.
 * - 직급 데이터는 외부 시스템에서 관리되므로 조회만 가능합니다.
 */
@Injectable()
export class RankService {
  /**
   * 직급 목록을_조회_한다
   */
  async 직급_목록을_조회_한다(): Promise<ApiResponse<RankDto[]>> {
    // TODO: 외부 API 연동 구현
    // 현재는 Mock 데이터 반환
    const ranks: RankDto[] = [
      {
        id: 'rank-001',
        name: '팀원',
        code: 'MEMBER',
        description: '일반 직원',
        order: 1,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'rank-002',
        name: '팀장',
        code: 'TEAM_LEADER',
        description: '팀 리더',
        order: 2,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'rank-003',
        name: '본부장',
        code: 'DIVISION_HEAD',
        description: '본부 책임자',
        order: 3,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'rank-004',
        name: '임원',
        code: 'EXECUTIVE',
        description: '경영진',
        order: 4,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ];

    return successResponse(ranks, '직급 목록을 성공적으로 조회했습니다.');
  }

  /**
   * 직급 상세 정보를 조회한다
   */
  async 직급을_조회_한다(rankId: string): Promise<ApiResponse<RankDto>> {
    // TODO: 외부 API 연동 구현
    // 현재는 Mock 데이터 반환
    const rank: RankDto = {
      id: rankId,
      name: '팀원',
      code: 'MEMBER',
      description: '일반 직원',
      order: 1,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    };

    return successResponse(rank, '직급 정보를 성공적으로 조회했습니다.');
  }
}
