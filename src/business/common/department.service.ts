import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Department } from '@domain/common/department/department.entity';
import type { DepartmentDto } from '@domain/common/department/department.types';
import {
  successResponse,
  type ApiResponse,
} from '@domain/common/types/api-response.types';

/**
 * 부서 비즈니스 서비스
 *
 * @description
 * - Department Entity와 DepartmentDto 간의 변환을 담당합니다.
 * - 부서 관련 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  /**
   * 부서 목록을 조회한다
   */
  async 부서_목록을_조회_한다(): Promise<ApiResponse<DepartmentDto[]>> {
    const departments = await this.departmentRepository.find({
      relations: ['parentDepartment'],
      order: {
        order: 'ASC',
      },
    });

    const departmentDtos = departments.map((dept) => dept.DTO로_변환한다());

    return successResponse(
      departmentDtos,
      '부서 목록을 성공적으로 조회했습니다.',
    );
  }

  /**
   * 부서 상세 정보를 조회한다
   */
  async 부서를_조회_한다(
    departmentId: string,
  ): Promise<ApiResponse<DepartmentDto>> {
    const department = await this.departmentRepository.findOne({
      where: { id: departmentId },
      relations: ['parentDepartment', 'childDepartments'],
    });

    if (!department) {
      throw new Error(`부서를 찾을 수 없습니다. ID: ${departmentId}`);
    }

    return successResponse(
      department.DTO로_변환한다(),
      '부서 정보를 성공적으로 조회했습니다.',
    );
  }

  /**
   * 최상위 부서 목록을 조회한다
   */
  async 최상위_부서_목록을_조회_한다(): Promise<ApiResponse<DepartmentDto[]>> {
    const departments = await this.departmentRepository.find({
      where: { parentDepartmentId: IsNull() },
      relations: ['childDepartments'],
      order: {
        order: 'ASC',
      },
    });

    const departmentDtos = departments.map((dept) => dept.DTO로_변환한다());

    return successResponse(
      departmentDtos,
      '최상위 부서 목록을 성공적으로 조회했습니다.',
    );
  }

  /**
   * 하위 부서 목록을 조회한다
   */
  async 하위_부서_목록을_조회_한다(
    parentDepartmentId: string,
  ): Promise<ApiResponse<DepartmentDto[]>> {
    const departments = await this.departmentRepository.find({
      where: { parentDepartmentId },
      relations: ['childDepartments'],
      order: {
        order: 'ASC',
      },
    });

    const departmentDtos = departments.map((dept) => dept.DTO로_변환한다());

    return successResponse(
      departmentDtos,
      '하위 부서 목록을 성공적으로 조회했습니다.',
    );
  }
}
