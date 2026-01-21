import { Module } from '@nestjs/common';
import { AuthContextModule } from '@context/auth-context';
import { NewsBusinessModule } from '@business/news-business/news-business.module';
import { NewsController } from './news.controller';
import { StrictBooleanValidationGuard } from '@interface/common/guards/strict-boolean-validation.guard';

/**
 * 뉴스 관리자 인터페이스 모듈
 * 뉴스 관리 엔드포인트를 제공합니다.
 */
@Module({
  imports: [AuthContextModule, NewsBusinessModule],
  controllers: [NewsController],
  providers: [StrictBooleanValidationGuard],
})
export class AdminNewsModule {}
