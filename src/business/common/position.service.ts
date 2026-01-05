import { Injectable } from '@nestjs/common';
import type { PositionDto } from '@domain/common/position/position.types';
import {
  successResponse,
  type ApiResponse,
} from '@domain/common/types/api-response.types';

/**
 * 직책 비즈니스 서비스
 *
 * @description
 * - 외부 시스템(EMS-PROD)의 직책 데이터를 조회합니다.
 * - 직책 데이터는 외부 시스템에서 관리되므로 조회만 가능합니다.
 */
@Injectable()
export class PositionService {
  /**
   * 직책 목록을 조회한다
   */
  async 직책_목록을_조회_한다(): Promise<ApiResponse<PositionDto[]>> {
    // TODO: 외부 API 연동 구현
    // 현재는 Mock 데이터 반환
    const positions: PositionDto[] = [
      {
        id: 'pos-001',
        name: '사원',
        code: 'STAFF',
        description: '신입 직책',
        order: 1,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'pos-002',
        name: '대리',
        code: 'ASSISTANT_MANAGER',
        description: '중급 직책',
        order: 2,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'pos-003',
        name: '과장',
        code: 'MANAGER',
        description: '중간관리자 직책',
        order: 3,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'pos-004',
        name: '차장',
        code: 'DEPUTY_GENERAL_MANAGER',
        description: '고급관리자 직책',
        order: 4,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'pos-005',
        name: '부장',
        code: 'GENERAL_MANAGER',
        description: '부서장 직책',
        order: 5,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ];

    return successResponse(positions, '직책 목록을 성공적으로 조회했습니다.');
  }

  /**
   * 직책 상세 정보를 조회한다
   */
  async 직책을_조회_한다(positionId: string): Promise<ApiResponse<PositionDto>> {
    // TODO: 외부 API 연동 구현
    // 현재는 Mock 데이터 반환
    const position: PositionDto = {
      id: positionId,
      name: '사원',
      code: 'STAFF',
      description: '신입 직책',
      order: 1,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    };

    return successResponse(position, '직책 정보를 성공적으로 조회했습니다.');
  }
}
