import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ElectronicDisclosure } from '@domain/core/electronic-disclosure/electronic-disclosure.entity';
import type { ElectronicDisclosureDto } from '@domain/core/electronic-disclosure/electronic-disclosure.types';
import {
  successResponse,
  type ApiResponse,
} from '@domain/common/types/api-response.types';

/**
 * 전자공시 비즈니스 서비스
 *
 * @description
 * - ElectronicDisclosure Entity와 ElectronicDisclosureDto 간의 변환을 담당합니다.
 * - 전자공시 관련 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class ElectronicNoticeService {
  constructor(
    @InjectRepository(ElectronicDisclosure)
    private readonly electronicDisclosureRepository: Repository<ElectronicDisclosure>,
  ) {}

  /**
   * 전자공시 목록을 조회한다
   */
  async 전자공시_목록을_조회_한다(
    code?: string,
  ): Promise<ApiResponse<ElectronicDisclosureDto[]>> {
    const queryBuilder = this.electronicDisclosureRepository
      .createQueryBuilder('electronicDisclosure')
      .leftJoinAndSelect('electronicDisclosure.manager', 'manager')
      .orderBy('electronicDisclosure.createdAt', 'DESC');

    // code 필터 추가 (필요시)
    if (code) {
      queryBuilder.andWhere('electronicDisclosure.category->>code = :code', {
        code,
      });
    }

    const disclosures = await queryBuilder.getMany();
    const disclosureDtos = disclosures.map((disclosure) =>
      disclosure.DTO로_변환한다(),
    );

    return successResponse(
      disclosureDtos,
      '전자공시 목록을 성공적으로 조회했습니다.',
    );
  }

  /**
   * 전자공시 상세 정보를 조회한다
   */
  async 전자공시를_조회_한다(
    disclosureId: string,
  ): Promise<ApiResponse<ElectronicDisclosureDto>> {
    const disclosure = await this.electronicDisclosureRepository.findOne({
      where: { id: disclosureId },
      relations: ['manager'],
    });

    if (!disclosure) {
      throw new Error(`전자공시를 찾을 수 없습니다. ID: ${disclosureId}`);
    }

    return successResponse(
      disclosure.DTO로_변환한다(),
      '전자공시 정보를 성공적으로 조회했습니다.',
    );
  }

  /**
   * 전자공시를 생성한다
   */
  async 전자공시를_생성_한다(
    data: Partial<ElectronicDisclosureDto>,
  ): Promise<ApiResponse<ElectronicDisclosureDto>> {
    const disclosure = this.electronicDisclosureRepository.create(data as any);
    const savedDisclosure = await this.electronicDisclosureRepository.save(
      disclosure,
    );
    
    // TypeORM save는 단일 엔티티 또는 배열을 반환할 수 있음
    const result = Array.isArray(savedDisclosure) ? savedDisclosure[0] : savedDisclosure;

    return successResponse(
      result.DTO로_변환한다(),
      '전자공시가 성공적으로 생성되었습니다.',
    );
  }

  /**
   * 전자공시를 수정한다
   */
  async 전자공시를_수정_한다(
    disclosureId: string,
    data: Partial<ElectronicDisclosureDto>,
  ): Promise<ApiResponse<ElectronicDisclosureDto>> {
    const disclosure = await this.electronicDisclosureRepository.findOne({
      where: { id: disclosureId },
      relations: ['manager'],
    });

    if (!disclosure) {
      throw new Error(`전자공시를 찾을 수 없습니다. ID: ${disclosureId}`);
    }

    Object.assign(disclosure, data);
    const updatedDisclosure = await this.electronicDisclosureRepository.save(
      disclosure,
    );

    return successResponse(
      updatedDisclosure.DTO로_변환한다(),
      '전자공시가 성공적으로 수정되었습니다.',
    );
  }

  /**
   * 전자공시를 삭제한다 (Soft Delete)
   */
  async 전자공시를_삭제_한다(
    disclosureId: string,
  ): Promise<ApiResponse<void>> {
    const result = await this.electronicDisclosureRepository.softDelete(
      disclosureId,
    );

    if (result.affected === 0) {
      throw new Error(`전자공시를 찾을 수 없습니다. ID: ${disclosureId}`);
    }

    return successResponse(
      undefined as any,
      '전자공시가 성공적으로 삭제되었습니다.',
    );
  }

  /**
   * 전자공시를 공개한다
   */
  async 전자공시를_공개_한다(
    disclosureId: string,
  ): Promise<ApiResponse<ElectronicDisclosureDto>> {
    const disclosure = await this.electronicDisclosureRepository.findOne({
      where: { id: disclosureId },
      relations: ['manager'],
    });

    if (!disclosure) {
      throw new Error(`전자공시를 찾을 수 없습니다. ID: ${disclosureId}`);
    }

    disclosure.공개한다();
    const updatedDisclosure = await this.electronicDisclosureRepository.save(
      disclosure,
    );

    return successResponse(
      updatedDisclosure.DTO로_변환한다(),
      '전자공시가 성공적으로 공개되었습니다.',
    );
  }

  /**
   * 전자공시를 비공개한다
   */
  async 전자공시를_비공개_한다(
    disclosureId: string,
  ): Promise<ApiResponse<ElectronicDisclosureDto>> {
    const disclosure = await this.electronicDisclosureRepository.findOne({
      where: { id: disclosureId },
      relations: ['manager'],
    });

    if (!disclosure) {
      throw new Error(`전자공시를 찾을 수 없습니다. ID: ${disclosureId}`);
    }

    disclosure.비공개한다();
    const updatedDisclosure = await this.electronicDisclosureRepository.save(
      disclosure,
    );

    return successResponse(
      updatedDisclosure.DTO로_변환한다(),
      '전자공시가 성공적으로 비공개되었습니다.',
    );
  }
}
