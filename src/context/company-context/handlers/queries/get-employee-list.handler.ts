import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Employee } from '../../interfaces/company-context.interface';

/**
 * 직원 목록 조회 쿼리
 */
export class GetEmployeeListQuery {
  constructor(public readonly employeeIds: string[]) {}
}

/**
 * 직원 목록 조회 핸들러
 *
 * SSO 서버의 직원 목록 조회 API를 사용하여 여러 직원 정보를 한 번에 가져옵니다.
 */
@Injectable()
@QueryHandler(GetEmployeeListQuery)
export class GetEmployeeListHandler
  implements IQueryHandler<GetEmployeeListQuery>
{
  private readonly logger = new Logger(GetEmployeeListHandler.name);
  private readonly ssoBaseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const baseUrl = this.configService.get<string>('SSO_BASE_URL') || '';
    this.ssoBaseUrl = baseUrl.replace(/\/$/, '');

    if (!this.ssoBaseUrl) {
      this.logger.warn('SSO_BASE_URL이 설정되지 않았습니다.');
    }
  }

  async execute(query: GetEmployeeListQuery): Promise<Employee[]> {
    try {
      this.logger.log(
        `직원 목록 조회 시작 - 요청 직원 수: ${query.employeeIds.length}`,
      );

      if (query.employeeIds.length === 0) {
        return [];
      }

      // SSO의 직원 목록 조회 API를 사용하여 한 번에 조회
      const response = await firstValueFrom(
        this.httpService.get(`${this.ssoBaseUrl}/api/organization/employees`, {
          params: {
            identifiers: query.employeeIds.join(','),
            withDetail: true, // 부서, 직급, 직책 정보 포함
          },
        }),
      );

      // 응답이 배열인지 확인하고, 배열이 아니면 빈 배열 반환
      let employees: Employee[];
      
      if (Array.isArray(response.data)) {
        employees = response.data;
      } else if (response.data && Array.isArray(response.data.employees)) {
        // 응답이 { employees: [...] } 형태인 경우
        employees = response.data.employees;
      } else if (response.data && Array.isArray(response.data.items)) {
        // 응답이 { items: [...] } 형태인 경우
        employees = response.data.items;
      } else {
        this.logger.warn(
          `예상치 못한 응답 형태 - ${JSON.stringify(response.data)}`,
        );
        employees = [];
      }

      this.logger.log(
        `직원 목록 조회 완료 - 요청: ${query.employeeIds.length}명, 조회 성공: ${employees.length}명`,
      );

      return employees;
    } catch (error) {
      this.logger.error(`직원 목록 조회 실패`, error);
      throw new Error('직원 목록을 가져오는데 실패했습니다.');
    }
  }
}
