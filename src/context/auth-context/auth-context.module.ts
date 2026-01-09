import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthContextService } from './auth-context.service';
import { LoginHandler, VerifyTokenHandler } from './handlers';

/**
 * 인증 컨텍스트 모듈
 *
 * SSO 서버를 통한 인증 및 토큰 검증을 담당합니다.
 */
@Module({
  imports: [
    HttpModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'lumir-cms-secret',
        signOptions: {
          expiresIn: '1d', // 1일
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthContextService, LoginHandler, VerifyTokenHandler],
  exports: [AuthContextService],
})
export class AuthContextModule {}
