import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  VerifyTokenCommand,
  VerifyTokenResult,
} from '../../interfaces/auth-context.interface';

/**
 * 토큰 검증 핸들러
 *
 * JWT 토큰을 검증하고 사용자 정보를 추출합니다.
 */
@Injectable()
@CommandHandler(VerifyTokenCommand)
export class VerifyTokenHandler implements ICommandHandler<VerifyTokenCommand> {
  private readonly logger = new Logger(VerifyTokenHandler.name);

  constructor(private readonly jwtService: JwtService) {}

  async execute(command: VerifyTokenCommand): Promise<VerifyTokenResult> {
    const { accessToken } = command;

    this.logger.debug('토큰 검증 시작');

    try {
      // JWT 토큰 검증 및 디코딩
      const payload = this.jwtService.verify(accessToken) as {
        sub: string;
        email: string;
        name: string;
        employeeNumber: string;
        roles: string[];
        status: string;
        iat: number;
        exp: number;
      };

      if (!payload || !payload.sub) {
        throw new UnauthorizedException('유효하지 않은 토큰입니다.');
      }

      this.logger.debug(`토큰 검증 성공: ${payload.sub} (${payload.email})`);

      return {
        user: {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          employeeNumber: payload.employeeNumber,
          roles: payload.roles,
          status: payload.status,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      // JWT 검증 실패 (만료, 서명 오류 등)
      if (error.name === 'TokenExpiredError') {
        this.logger.error('만료된 토큰입니다.');
        throw new UnauthorizedException('만료된 토큰입니다.');
      }

      if (error.name === 'JsonWebTokenError') {
        this.logger.error('유효하지 않은 토큰입니다.');
        throw new UnauthorizedException('유효하지 않은 토큰입니다.');
      }

      this.logger.error('토큰 검증 실패', error);
      throw new UnauthorizedException('토큰 검증에 실패했습니다.');
    }
  }
}
