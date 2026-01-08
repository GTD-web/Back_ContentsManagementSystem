import { Module } from '@nestjs/common';
import { CommonDomainModule } from './common/common-domain.module';
import { CoreDomainModule } from './core/core-domain.module';
import { SubDomainModule } from './sub/sub-domain.module';

/**
 * Domain Layer 통합 모듈
 *
 * 모든 도메인 계층의 모듈을 통합합니다.
 * - Common Domain: 시스템 전반 공유 엔티티
 * - Core Domain: 핵심 비즈니스 로직
 * - Sub Domain: 부가 지원 기능
 */
@Module({
  imports: [CommonDomainModule, CoreDomainModule, SubDomainModule],
  exports: [CommonDomainModule, CoreDomainModule, SubDomainModule],
})
export class DomainModule {}
