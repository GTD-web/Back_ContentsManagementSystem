import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '@domain/common/employee/employee.entity';
import type {
  EmployeeDto,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeFilter,
  EmployeeListOptions,
} from '@domain/common/employee/employee.types';
import { successResponse, type ApiResponse } from '@domain/common/types/api-response.types';

/**
 * 직원 비즈니스 서비스
 *
 * @description
 * - Employee Entity와 EmployeeDto 간의 변환을 담당합니다.
 * - 직원 관련 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  /**
   * 직원 목록을 조회한다
   */
  async 직원_목록을_조회_한다(
    options?: EmployeeListOptions,
  ): Promise<ApiResponse<EmployeeDto[]>> {
    const queryBuilder = this.employeeRepository.createQueryBuilder('employee');

    // 필터 적용
    if (options?.filter) {
      this.필터를_적용_한다(queryBuilder, options.filter);
    }

    // 정렬 적용
    if (options?.sortBy && options?.sortOrder) {
      queryBuilder.orderBy(
        `employee.${options.sortBy}`,
        options.sortOrder as 'ASC' | 'DESC',
      );
    }

    // 페이지네이션 적용
    if (options?.page && options?.limit) {
      queryBuilder.skip((options.page - 1) * options.limit);
      queryBuilder.take(options.limit);
    }

    const employees = await queryBuilder.getMany();
    const employeeDtos = employees.map((employee) => employee.DTO로_변환한다());

    return successResponse(employeeDtos, '직원 목록을 성공적으로 조회했습니다.');
  }

  /**
   * 직원 상세 정보를 조회한다
   */
  async 직원을_조회_한다(employeeId: string): Promise<ApiResponse<EmployeeDto>> {
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new Error(`직원을 찾을 수 없습니다. ID: ${employeeId}`);
    }

    return successResponse(employee.DTO로_변환한다(), '직원 정보를 성공적으로 조회했습니다.');
  }

  /**
   * 직원을 생성한다
   */
  async 직원을_생성_한다(
    data: CreateEmployeeDto,
  ): Promise<ApiResponse<EmployeeDto>> {
    const employee = this.employeeRepository.create(data);
    const savedEmployee = await this.employeeRepository.save(employee);

    return successResponse(savedEmployee.DTO로_변환한다(), '직원이 성공적으로 생성되었습니다.');
  }

  /**
   * 직원 정보를 수정한다
   */
  async 직원을_수정_한다(
    employeeId: string,
    data: UpdateEmployeeDto,
  ): Promise<ApiResponse<EmployeeDto>> {
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new Error(`직원을 찾을 수 없습니다. ID: ${employeeId}`);
    }

    Object.assign(employee, data);
    const updatedEmployee = await this.employeeRepository.save(employee);

    return successResponse(updatedEmployee.DTO로_변환한다(), '직원 정보가 성공적으로 수정되었습니다.');
  }

  /**
   * 직원을 삭제한다 (Soft Delete)
   */
  async 직원을_삭제_한다(employeeId: string): Promise<ApiResponse<void>> {
    const result = await this.employeeRepository.softDelete(employeeId);

    if (result.affected === 0) {
      throw new Error(`직원을 찾을 수 없습니다. ID: ${employeeId}`);
    }

    return successResponse(undefined as any, '직원이 성공적으로 삭제되었습니다.');
  }

  /**
   * QueryBuilder에 필터를 적용한다
   */
  private 필터를_적용_한다(
    queryBuilder: any,
    filter: EmployeeFilter,
  ): void {
    if (filter.departmentId) {
      queryBuilder.andWhere('employee.departmentId = :departmentId', {
        departmentId: filter.departmentId,
      });
    }

    if (filter.positionId) {
      queryBuilder.andWhere('employee.positionId = :positionId', {
        positionId: filter.positionId,
      });
    }

    if (filter.rankId) {
      queryBuilder.andWhere('employee.rankId = :rankId', {
        rankId: filter.rankId,
      });
    }

    if (filter.status) {
      queryBuilder.andWhere('employee.status = :status', {
        status: filter.status,
      });
    }

    if (filter.gender) {
      queryBuilder.andWhere('employee.gender = :gender', {
        gender: filter.gender,
      });
    }

    if (filter.managerId) {
      queryBuilder.andWhere('employee.managerId = :managerId', {
        managerId: filter.managerId,
      });
    }

    // 제외된 직원 필터
    if (!filter.includeExcluded) {
      queryBuilder.andWhere('employee.isExcludedFromList = :isExcluded', {
        isExcluded: false,
      });
    }
  }
}
