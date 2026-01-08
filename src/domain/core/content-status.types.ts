/**
 * 콘텐츠 상태 Enum
 * 
 * 대부분의 Core/Sub Domain 엔티티에서 사용하는 공통 상태
 */
export enum ContentStatus {
  /** 초안 */
  DRAFT = 'draft',

  /** 승인됨 */
  APPROVED = 'approved',

  /** 검토중 */
  UNDER_REVIEW = 'under_review',

  /** 거부됨 */
  REJECTED = 'rejected',

  /** 공개됨 */
  OPENED = 'opened',
}
