/**
 * 교육 상태 Enum
 * 
 * EducationManagement의 진행 상태
 */
export enum EducationStatus {
  /** 예정됨 (시작 전) */
  SCHEDULED = 'scheduled',

  /** 진행 중 */
  IN_PROGRESS = 'in_progress',

  /** 완료됨 */
  COMPLETED = 'completed',

  /** 취소됨 */
  CANCELLED = 'cancelled',

  /** 연기됨 */
  POSTPONED = 'postponed',
}
