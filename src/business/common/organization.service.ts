import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '@domain/common/department/department.entity';
import { Employee } from '@domain/common/employee/employee.entity';
import type {
  OrganizationHierarchyDto,
  OrganizationNode,
} from '@domain/common/organization/organization.types';
import {
  successResponse,
  type ApiResponse,
} from '@domain/common/types/api-response.types';

/**
 * 조직 하이라키 비즈니스 서비스
 *
 * @description
 * - 조직 계층 구조를 조회합니다.
 * - 부서와 직원 정보를 포함한 트리 구조를 생성합니다.
 */
@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  /**
   * 조직 하이라키를 조회한다
   */
  async 조직_하이라키를_조회_한다(options?: {
    includeEmployees?: boolean;
  }): Promise<ApiResponse<OrganizationHierarchyDto>> {
    const includeEmployees = options?.includeEmployees ?? true;

    // 모든 부서 조회
    const departments = await this.departmentRepository.find({
      relations: ['parentDepartment'],
      order: {
        order: 'ASC',
      },
    });

    // 직원 정보 조회 (옵션에 따라)
    let employees: Employee[] = [];
    if (includeEmployees) {
      employees = await this.employeeRepository.find({
        where: { isExcludedFromList: false },
      });
    }

    // 트리 구조 생성
    const hierarchy = this.트리_구조를_생성_한다(
      departments,
      employees,
      includeEmployees,
    );

    return successResponse(
      hierarchy,
      '조직 하이라키를 성공적으로 조회했습니다.',
    );
  }

  /**
   * 부서 트리 구조를 생성한다
   */
  private 트리_구조를_생성_한다(
    departments: Department[],
    employees: Employee[],
    includeEmployees: boolean,
  ): OrganizationHierarchyDto {
    // 재귀적으로 트리 구조 생성
    const buildNode = (
      department: Department,
      depth: number,
    ): OrganizationNode => {
      const deptDto = department.DTO로_변환한다();
      const deptEmployees = includeEmployees
        ? employees
            .filter((emp) => emp.departmentId === department.externalId)
            .map((emp) => emp.DTO로_변환한다())
        : [];

      const childDepartments = departments.filter(
        (d) => d.parentDepartmentId === department.id,
      );

      const children = childDepartments.map((child) =>
        buildNode(child, depth + 1),
      );

      return {
        department: deptDto,
        employees: deptEmployees,
        children,
        depth,
      };
    };

    // 최상위 부서들 찾기
    const rootDepartments = departments.filter((d) => !d.parentDepartmentId);

    // 루트 노드가 여러 개인 경우 가상 루트 생성
    const rootNode: OrganizationNode = {
      department: {
        id: 'root',
        name: '전체 조직',
        code: 'ROOT',
        order: 0,
        externalId: 'root',
        externalCreatedAt: new Date(),
        externalUpdatedAt: new Date(),
        isExcludedFromList: false,
        isAccessible: true,
      } as any,
      employees: [],
      children: rootDepartments.map((dept) => buildNode(dept, 1)),
      depth: 0,
    };

    // 최대 깊이 계산
    const calculateMaxDepth = (node: OrganizationNode): number => {
      if (node.children.length === 0) return node.depth;
      return Math.max(
        ...node.children.map((child) => calculateMaxDepth(child)),
      );
    };

    // 전체 부서 및 직원 수 계산
    const countNodes = (
      node: OrganizationNode,
    ): { departments: number; employees: number } => {
      const childCounts = node.children.map((child) => countNodes(child));
      return {
        departments:
          1 + childCounts.reduce((sum, count) => sum + count.departments, 0),
        employees:
          node.employees.length +
          childCounts.reduce((sum, count) => sum + count.employees, 0),
      };
    };

    const counts = countNodes(rootNode);
    const maxDepth = calculateMaxDepth(rootNode);

    return {
      root: rootNode,
      totalDepartments: counts.departments - 1, // 가상 루트 제외
      totalEmployees: counts.employees,
      maxDepth,
      fetchedAt: new Date(),
    };
  }
}
