/**
 * Common Domain Export
 * 
 * 시스템 전반에서 공유되는 공통 엔티티
 * - Language: 다국어 지원
 * - Category: 통합 카테고리 관리
 * - CategoryMapping: 엔티티-카테고리 다대다 관계
 */

// Language Module
export * from './language/language.entity';
export * from './language/language-code.types';

// Category Module
export * from './category/category.entity';
export * from './category/category-mapping.entity';
export * from './category/category-entity-type.types';
