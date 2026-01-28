import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  VerifyTokenCommand,
  VerifyTokenResult,
} from '../../interfaces/auth-context.interface';

/**
 * 토큰 검증 핸들러
 *
 * SSO 서버의 /api/auth/verify 엔드포인트를 통해 토큰을 검증합니다.
 */
@Injectable()
@CommandHandler(VerifyTokenCommand)
export class VerifyTokenHandler implements ICommandHandler<VerifyTokenCommand> {
  private readonly logger = new Logger(VerifyTokenHandler.name);
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

  async execute(command: VerifyTokenCommand): Promise<VerifyTokenResult> {
    const { accessToken } = command;

    this.logger.debug('SSO 토큰 검증 시작');

    try {
      // SSO 서버에 토큰 검증 요청
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.ssoBaseUrl}/api/auth/verify`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        ),
      );

      const data = response.data as {
        valid: boolean;
        user_info: {
          id: string;
          name: string;
          email: string;
          employee_number: string;
        };
        expires_in: number;
      };

      if (!data.valid || !data.user_info) {
        throw new UnauthorizedException('유효하지 않은 토큰입니다.');
      }

      const userInfo = data.user_info;

      this.logger.debug(
        `토큰 검증 성공: ${userInfo.id} (${userInfo.email}), 사번: ${userInfo.employee_number}`,
      );

      return {
        user: {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          employeeNumber: userInfo.employee_number,
          roles: [], // SSO verify 응답에 roles 정보가 없으므로 빈 배열
          status: 'ACTIVE',
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      // SSO API 호출 실패
      if (error.response?.status === 401) {
        this.logger.error('유효하지 않은 토큰입니다.');
        throw new UnauthorizedException('유효하지 않은 토큰입니다.');
      }

      if (error.response?.status === 400) {
        this.logger.error('잘못된 토큰 형식입니다.');
        throw new UnauthorizedException('잘못된 토큰 형식입니다.');
      }

      this.logger.error('토큰 검증 실패', error.message || error);
      throw new UnauthorizedException('토큰 검증에 실패했습니다.');
    }
  }
}
