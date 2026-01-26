import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetOrganizationInfoQuery } from './handlers/queries/get-organization-info.handler';
import { GetDepartmentListQuery } from './handlers/queries/get-department-list.handler';
import { GetRankListQuery } from './handlers/queries/get-rank-list.handler';
import { GetPositionListQuery } from './handlers/queries/get-position-list.handler';
import { GetEmployeeQuery } from './handlers/queries/get-employee.handler';
import { GetEmployeeListQuery } from './handlers/queries/get-employee-list.handler';
import {
  OrganizationInfo,
  DepartmentListResult,
  RankListResult,
  PositionListResult,
  Employee,
} from './interfaces/company-context.interface';

/**
 * 조직 컨텍스트 서비스
 *
 * SSO 서버로부터 조직, 부서, 직급, 직책 정보를 조회합니다.
 */
@Injectable()
export class CompanyContextService {
  constructor(private readonly queryBus: QueryBus) {}

  /**
   * 조직 정보를 가져온다
   */
  async 조직_정보를_가져온다(): Promise<OrganizationInfo> {
    const query = new GetOrganizationInfoQuery();
    return await this.queryBus.execute(query);
  }

  /**
   * 부서 정보를 가져온다
   */
  async 부서_정보를_가져온다(): Promise<DepartmentListResult> {
    const query = new GetDepartmentListQuery();
    return await this.queryBus.execute(query);
  }

  /**
   * 직급 정보를 가져온다
   */
  async 직급_정보를_가져온다(): Promise<RankListResult> {
    const query = new GetRankListQuery();
    return await this.queryBus.execute(query);
  }

  /**
   * 직책 정보를 가져온다
   */
  async 직책_정보를_가져온다(): Promise<PositionListResult> {
    const query = new GetPositionListQuery();
    return await this.queryBus.execute(query);
  }

  /**
   * 직원 정보를 조회한다 (단건)
   */
  async 직원_정보를_조회한다(employeeId: string): Promise<Employee | null> {
    const query = new GetEmployeeQuery(employeeId);
    return await this.queryBus.execute(query);
  }

  /**
   * 직원 목록을 조회한다 (복수)
   */
  async 직원_목록을_조회한다(employeeIds: string[]): Promise<Employee[]> {
    const query = new GetEmployeeListQuery(employeeIds);
    return await this.queryBus.execute(query);
  }
}
