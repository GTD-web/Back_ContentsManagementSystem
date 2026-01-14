import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { OrganizationInfo } from '../../interfaces/company-context.interface';

/**
 * 조직 정보 조회 쿼리
 */
export class GetOrganizationInfoQuery {
  constructor() {}
}

/**
 * 조직 정보 조회 핸들러
 *
 * SSO 서버로부터 전체 조직 구조를 가져옵니다.
 */
@Injectable()
@QueryHandler(GetOrganizationInfoQuery)
export class GetOrganizationInfoHandler
  implements IQueryHandler<GetOrganizationInfoQuery>
{
  private readonly logger = new Logger(GetOrganizationInfoHandler.name);
  private readonly ssoBaseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const baseUrl = this.configService.get<string>('SSO_BASE_URL') || '';
    // trailing slash 제거
    this.ssoBaseUrl = baseUrl.replace(/\/$/, '');

    if (!this.ssoBaseUrl) {
      this.logger.warn('SSO_BASE_URL이 설정되지 않았습니다.');
    }
  }

  async execute(query: GetOrganizationInfoQuery): Promise<OrganizationInfo> {
    this.logger.debug('조직 정보 조회 시작');

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.ssoBaseUrl}/api/admin/organizations`),
      );

      this.logger.debug('조직 정보 조회 완료');

      return response.data as OrganizationInfo;
    } catch (error) {
      this.logger.error('조직 정보 조회 실패', error);
      throw new Error('조직 정보를 가져오는데 실패했습니다.');
    }
  }
}
