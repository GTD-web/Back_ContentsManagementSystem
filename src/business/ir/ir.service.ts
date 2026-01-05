import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IR } from '@domain/core/ir/ir.entity';
import type { IRDto } from '@domain/core/ir/ir.types';
import {
  successResponse,
  type ApiResponse,
} from '@domain/common/types/api-response.types';

/**
 * IR 비즈니스 서비스
 *
 * @description
 * - IR Entity와 IRDto 간의 변환을 담당합니다.
 * - IR(투자자 관계) 관련 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class IRService {
  constructor(
    @InjectRepository(IR)
    private readonly irRepository: Repository<IR>,
  ) {}

  /**
   * IR 목록을 조회한다
   */
  async IR_목록을_조회_한다(code?: string): Promise<ApiResponse<IRDto[]>> {
    const queryBuilder = this.irRepository
      .createQueryBuilder('ir')
      .leftJoinAndSelect('ir.manager', 'manager')
      .orderBy('ir.createdAt', 'DESC');

    // code 필터 추가 (필요시)
    if (code) {
      queryBuilder.andWhere('ir.category->>code = :code', { code });
    }

    const irList = await queryBuilder.getMany();
    const irDtos = irList.map((ir) => ir.DTO로_변환한다());

    return successResponse(irDtos, 'IR 목록을 성공적으로 조회했습니다.');
  }

  /**
   * IR 상세 정보를 조회한다
   */
  async IR을_조회_한다(irId: string): Promise<ApiResponse<IRDto>> {
    const ir = await this.irRepository.findOne({
      where: { id: irId },
      relations: ['manager'],
    });

    if (!ir) {
      throw new Error(`IR을 찾을 수 없습니다. ID: ${irId}`);
    }

    return successResponse(ir.DTO로_변환한다(), 'IR 정보를 성공적으로 조회했습니다.');
  }

  /**
   * IR을 생성한다
   */
  async IR을_생성_한다(data: Partial<IRDto>): Promise<ApiResponse<IRDto>> {
    const ir = this.irRepository.create(data as any);
    const savedIR = await this.irRepository.save(ir);
    
    // TypeORM save는 단일 엔티티 또는 배열을 반환할 수 있음
    const result = Array.isArray(savedIR) ? savedIR[0] : savedIR;

    return successResponse(result.DTO로_변환한다(), 'IR이 성공적으로 생성되었습니다.');
  }

  /**
   * IR을 수정한다
   */
  async IR을_수정_한다(
    irId: string,
    data: Partial<IRDto>,
  ): Promise<ApiResponse<IRDto>> {
    const ir = await this.irRepository.findOne({
      where: { id: irId },
      relations: ['manager'],
    });

    if (!ir) {
      throw new Error(`IR을 찾을 수 없습니다. ID: ${irId}`);
    }

    Object.assign(ir, data);
    const updatedIR = await this.irRepository.save(ir);

    return successResponse(updatedIR.DTO로_변환한다(), 'IR이 성공적으로 수정되었습니다.');
  }

  /**
   * IR을 삭제한다 (Soft Delete)
   */
  async IR을_삭제_한다(irId: string): Promise<ApiResponse<void>> {
    const result = await this.irRepository.softDelete(irId);

    if (result.affected === 0) {
      throw new Error(`IR을 찾을 수 없습니다. ID: ${irId}`);
    }

    return successResponse(undefined as any, 'IR이 성공적으로 삭제되었습니다.');
  }

  /**
   * IR을 공개한다
   */
  async IR을_공개_한다(irId: string): Promise<ApiResponse<IRDto>> {
    const ir = await this.irRepository.findOne({
      where: { id: irId },
      relations: ['manager'],
    });

    if (!ir) {
      throw new Error(`IR을 찾을 수 없습니다. ID: ${irId}`);
    }

    ir.공개한다();
    const updatedIR = await this.irRepository.save(ir);

    return successResponse(updatedIR.DTO로_변환한다(), 'IR이 성공적으로 공개되었습니다.');
  }

  /**
   * IR을 비공개한다
   */
  async IR을_비공개_한다(irId: string): Promise<ApiResponse<IRDto>> {
    const ir = await this.irRepository.findOne({
      where: { id: irId },
      relations: ['manager'],
    });

    if (!ir) {
      throw new Error(`IR을 찾을 수 없습니다. ID: ${irId}`);
    }

    ir.비공개한다();
    const updatedIR = await this.irRepository.save(ir);

    return successResponse(updatedIR.DTO로_변환한다(), 'IR이 성공적으로 비공개되었습니다.');
  }
}
