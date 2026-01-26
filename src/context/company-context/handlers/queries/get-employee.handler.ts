import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Employee } from '../../interfaces/company-context.interface';

/**
 * 직원 정보 조회 쿼리
 */
export class GetEmployeeQuery {
  constructor(public readonly employeeId: string) {}
}

/**
 * 직원 정보 조회 핸들러
 *
 * SSO 서버로부터 조직 정보를 가져와서 특정 직원 정보를 찾습니다.
 */
@Injectable()
@QueryHandler(GetEmployeeQuery)
export class GetEmployeeHandler implements IQueryHandler<GetEmployeeQuery> {
  private readonly logger = new Logger(GetEmployeeHandler.name);
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

  async execute(query: GetEmployeeQuery): Promise<Employee | null> {
    try {
      this.logger.log(`직원 정보 조회 시작 - ID: ${query.employeeId}`);

      // SSO로부터 직원 상세 정보 조회 (쿼리 파라미터로 employeeNumber 사용)
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.ssoBaseUrl}/api/organization/employee`,
          {
            params: {
              employeeNumber: query.employeeId,
              withDetail: true, // 부서, 직급, 직책 정보 포함
            },
          },
        ),
      );

      const employee = response.data as Employee;

      // SSO 응답 데이터 로깅 (디버깅용)
      this.logger.debug(
        `SSO 응답 데이터 - ID: ${query.employeeId}, 응답: ${JSON.stringify(employee)}`,
      );

      this.logger.log(`직원 정보 조회 완료 - ID: ${query.employeeId}`);

      return employee;
    } catch (error: any) {
      if (error.response?.status === 404) {
        this.logger.warn(`직원을 찾을 수 없음 - ID: ${query.employeeId}`);
        return null;
      }

      this.logger.error(
        `직원 정보 조회 실패 - ID: ${query.employeeId}`,
        error,
      );
      throw new Error('직원 정보를 가져오는데 실패했습니다.');
    }
  }
}
