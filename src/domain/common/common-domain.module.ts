import { Module } from '@nestjs/common';
import { LanguageModule } from './language/language.module';
import { CategoryModule } from './category/category.module';
import { SsoModule } from './sso/sso.module';
import { DismissedPermissionLogModule } from './dismissed-permission-log/dismissed-permission-log.module';
import { AdminModule } from './admin/admin.module';

/**
 * Common Domain 통합 모듈
 * 공통 도메인의 모든 모듈을 통합합니다.
 * - Category: 카테고리 관리
 * - Language: 다국어 언어 관리
 * - Sso: SSO API 연동 (조직 정보, FCM 토큰)
 * - DismissedPermissionLog: 권한 로그 "다시 보지 않기" 기능
 * - Admin: 관리자 허용 목록 관리
 */
@Module({
  imports: [
    LanguageModule,
    CategoryModule,
    SsoModule,
    DismissedPermissionLogModule,
    AdminModule,
  ],
  exports: [
    LanguageModule,
    CategoryModule,
    SsoModule,
    DismissedPermissionLogModule,
    AdminModule,
  ],
})
export class CommonDomainModule {}
