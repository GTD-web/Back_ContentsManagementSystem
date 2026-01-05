import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brochure } from '@domain/core/brochure/brochure.entity';
import type { BrochureDto } from '@domain/core/brochure/brochure.types';
import {
  successResponse,
  type ApiResponse,
} from '@domain/common/types/api-response.types';

/**
 * 브로슈어 비즈니스 서비스
 *
 * @description
 * - Brochure Entity와 BrochureDto 간의 변환을 담당합니다.
 * - 브로슈어 관련 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class BrochureService {
  constructor(
    @InjectRepository(Brochure)
    private readonly brochureRepository: Repository<Brochure>,
  ) {}

  /**
   * 브로슈어 목록을 조회한다
   */
  async 브로슈어_목록을_조회_한다(
    code?: string,
  ): Promise<ApiResponse<BrochureDto[]>> {
    const queryBuilder = this.brochureRepository
      .createQueryBuilder('brochure')
      .leftJoinAndSelect('brochure.manager', 'manager')
      .orderBy('brochure.createdAt', 'DESC');

    // code 필터 추가 (필요시)
    if (code) {
      queryBuilder.andWhere('brochure.category->>code = :code', { code });
    }

    const brochures = await queryBuilder.getMany();
    const brochureDtos = brochures.map((brochure) =>
      brochure.DTO로_변환한다(),
    );

    return successResponse(
      brochureDtos,
      '브로슈어 목록을 성공적으로 조회했습니다.',
    );
  }

  /**
   * 브로슈어 상세 정보를 조회한다
   */
  async 브로슈어를_조회_한다(
    brochureId: string,
  ): Promise<ApiResponse<BrochureDto>> {
    const brochure = await this.brochureRepository.findOne({
      where: { id: brochureId },
      relations: ['manager'],
    });

    if (!brochure) {
      throw new Error(`브로슈어를 찾을 수 없습니다. ID: ${brochureId}`);
    }

    return successResponse(
      brochure.DTO로_변환한다(),
      '브로슈어 정보를 성공적으로 조회했습니다.',
    );
  }

  /**
   * 브로슈어를 생성한다
   */
  async 브로슈어를_생성_한다(
    data: Partial<BrochureDto>,
  ): Promise<ApiResponse<BrochureDto>> {
    const brochure = this.brochureRepository.create(data as any);
    const savedBrochure = await this.brochureRepository.save(brochure);
    
    // TypeORM save는 단일 엔티티 또는 배열을 반환할 수 있음
    const result = Array.isArray(savedBrochure) ? savedBrochure[0] : savedBrochure;

    return successResponse(
      result.DTO로_변환한다(),
      '브로슈어가 성공적으로 생성되었습니다.',
    );
  }

  /**
   * 브로슈어를 수정한다
   */
  async 브로슈어를_수정_한다(
    brochureId: string,
    data: Partial<BrochureDto>,
  ): Promise<ApiResponse<BrochureDto>> {
    const brochure = await this.brochureRepository.findOne({
      where: { id: brochureId },
      relations: ['manager'],
    });

    if (!brochure) {
      throw new Error(`브로슈어를 찾을 수 없습니다. ID: ${brochureId}`);
    }

    Object.assign(brochure, data);
    const updatedBrochure = await this.brochureRepository.save(brochure);

    return successResponse(
      updatedBrochure.DTO로_변환한다(),
      '브로슈어가 성공적으로 수정되었습니다.',
    );
  }

  /**
   * 브로슈어를 삭제한다 (Soft Delete)
   */
  async 브로슈어를_삭제_한다(brochureId: string): Promise<ApiResponse<void>> {
    const result = await this.brochureRepository.softDelete(brochureId);

    if (result.affected === 0) {
      throw new Error(`브로슈어를 찾을 수 없습니다. ID: ${brochureId}`);
    }

    return successResponse(
      undefined as any,
      '브로슈어가 성공적으로 삭제되었습니다.',
    );
  }

  /**
   * 브로슈어를 공개한다
   */
  async 브로슈어를_공개_한다(
    brochureId: string,
  ): Promise<ApiResponse<BrochureDto>> {
    const brochure = await this.brochureRepository.findOne({
      where: { id: brochureId },
      relations: ['manager'],
    });

    if (!brochure) {
      throw new Error(`브로슈어를 찾을 수 없습니다. ID: ${brochureId}`);
    }

    brochure.공개한다();
    const updatedBrochure = await this.brochureRepository.save(brochure);

    return successResponse(
      updatedBrochure.DTO로_변환한다(),
      '브로슈어가 성공적으로 공개되었습니다.',
    );
  }

  /**
   * 브로슈어를 비공개한다
   */
  async 브로슈어를_비공개_한다(
    brochureId: string,
  ): Promise<ApiResponse<BrochureDto>> {
    const brochure = await this.brochureRepository.findOne({
      where: { id: brochureId },
      relations: ['manager'],
    });

    if (!brochure) {
      throw new Error(`브로슈어를 찾을 수 없습니다. ID: ${brochureId}`);
    }

    brochure.비공개한다();
    const updatedBrochure = await this.brochureRepository.save(brochure);

    return successResponse(
      updatedBrochure.DTO로_변환한다(),
      '브로슈어가 성공적으로 비공개되었습니다.',
    );
  }
}
