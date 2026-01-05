/**
 * 공통 상태 타입 정의
 */

export enum ContentStatus {
  DRAFT = 'draft', // 초안
  APPROVED = 'approved', // 승인됨
  UNDER_REVIEW = 'under_review', // 검토중
  REJECTED = 'rejected', // 거부됨
  OPENED = 'opened', // 공개됨
}

export type AnnouncementStatus = ContentStatus;
export type ElectronicDisclosureStatus = ContentStatus;
export type IRStatus = ContentStatus;
export type BrochureStatus = ContentStatus;
export type LumirStoryStatus = ContentStatus;
export type VideoGalleryStatus = ContentStatus;
export type NewsStatus = ContentStatus;
export type SurveyStatus = ContentStatus;

/**
 * 상태가 공개 가능한 상태인지 확인
 */
export function 공개_가능한_상태인가(status: ContentStatus): boolean {
  return status === ContentStatus.APPROVED || status === ContentStatus.OPENED;
}

/**
 * 상태가 수정 가능한 상태인지 확인
 */
export function 수정_가능한_상태인가(status: ContentStatus): boolean {
  return status === ContentStatus.DRAFT || status === ContentStatus.REJECTED;
}
