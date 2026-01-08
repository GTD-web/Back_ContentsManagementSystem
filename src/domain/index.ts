/**
 * Domain Layer Export
 *
 * 도메인 계층의 모든 엔티티, Enum, 타입을 내보냅니다.
 *
 * 도메인 구조:
 * - Common Domain: 시스템 전반 공유 엔티티
 * - Core Domain: 핵심 비즈니스 로직
 * - Sub Domain: 부가 지원 기능
 */

// Common Domain
export * from './common';

// Core Domain
export * from './core';

// Sub Domain
export * from './sub';
