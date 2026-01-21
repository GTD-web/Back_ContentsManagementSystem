import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import {
  LoginCommand,
  LoginResult,
} from '../../interfaces/auth-context.interface';

/**
 * SSO 로그인 핸들러
 *
 * SSO 서버를 통해 사용자를 인증하고 토큰을 발급받습니다.
 */
@Injectable()
@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  private readonly logger = new Logger(LoginHandler.name);
  private readonly ssoBaseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    const baseUrl = this.configService.get<string>('SSO_BASE_URL') || '';
    // trailing slash 제거
    this.ssoBaseUrl = baseUrl.replace(/\/$/, '');

    if (!this.ssoBaseUrl) {
      this.logger.warn('SSO_BASE_URL이 설정되지 않았습니다.');
    }
  }

  async execute(command: LoginCommand): Promise<LoginResult> {
    const { email, password } = command;

    this.logger.log(`로그인 시도: ${email}`);

    try {
      // SSO 서버에 로그인 요청
      const response = await firstValueFrom(
        this.httpService.post(`${this.ssoBaseUrl}/api/auth/login`, {
          grant_type: 'password',
          email,
          password,
        }),
      );

      // SSO 서버 응답 데이터 (실제 구조에 맞게 타입 정의)
      const data = response.data as {
        tokenType: string;
        accessToken: string;
        expiresAt: string;
        refreshToken: string;
        refreshTokenExpiresAt: string;
        id: string;
        name: string;
        email: string;
        employeeNumber: string;
        status: string;
        systemRoles: Record<string, string[]>;
      };

      // NODE_ENV에 따라 CMS 시스템 선택
      const nodeEnv = this.configService.get<string>('NODE_ENV', 'development');
      const cmsSystemName = nodeEnv === 'production' ? 'CMS-PROD' : 'CMS-DEV';
      
      // 해당 CMS 시스템의 역할 추출
      const cmsRoles = data.systemRoles[cmsSystemName] || [];

      // 자체 JWT 생성 (email, name 포함)
      const payload = {
        sub: data.id, // 사용자 ID
        email: data.email,
        name: data.name,
        employeeNumber: data.employeeNumber,
        roles: cmsRoles,
        status: data.status,
      };

      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: '7d', // 리프레시 토큰은 7일
      });

      this.logger.log(`로그인 성공: ${email} (시스템: ${cmsSystemName}, 역할: ${cmsRoles.join(', ')})`);

      return {
        accessToken,
        refreshToken,
        user: {
          id: data.id,
          externalId: data.id, // SSO의 id를 externalId로 사용
          email: data.email,
          name: data.name,
          employeeNumber: data.employeeNumber,
          roles: cmsRoles, // CMS 시스템의 역할
          status: data.status,
        },
      };
    } catch (error) {
      this.logger.error(`로그인 실패: ${email}`, error);

      if (error.response?.status === 401) {
        throw new UnauthorizedException(
          '이메일 또는 비밀번호가 올바르지 않습니다.',
        );
      }

      throw new UnauthorizedException('로그인에 실패했습니다.');
    }
  }
}
