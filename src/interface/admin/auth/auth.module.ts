import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';

/**
 * 인증 인터페이스 모듈
 *
 * SSO 서버와 직접 통신하여 인증을 처리합니다.
 */
@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [AuthController],
})
export class AuthInterfaceModule {}
