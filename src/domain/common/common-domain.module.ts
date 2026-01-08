import { Module } from '@nestjs/common';
import { LanguageModule } from './language/language.module';
import { CategoryModule } from './category/category.module';

/**
 * Common Domain 통합 모듈
 * 공통 도메인의 모든 모듈을 통합합니다.
 */
@Module({
  imports: [LanguageModule, CategoryModule],
  exports: [LanguageModule, CategoryModule],
})
export class CommonDomainModule {}
