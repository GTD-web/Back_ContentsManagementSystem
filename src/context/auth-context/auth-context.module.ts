import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AuthContextService } from './auth-context.service';
import { LoginHandler, VerifyTokenHandler } from './handlers';

/**
 * 인증 컨텍스트 모듈
 *
 * SSO 서버를 통한 인증 및 토큰 검증을 담당합니다.
 * SSO 토큰을 그대로 사용하며, 자체 JWT를 생성하지 않습니다.
 */
@Module({
  imports: [HttpModule, ConfigModule],
  providers: [AuthContextService, LoginHandler, VerifyTokenHandler],
  exports: [AuthContextService],
})
export class AuthContextModule {}
