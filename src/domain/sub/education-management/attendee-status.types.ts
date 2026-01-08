/**
 * 수강 상태 Enum
 * 
 * Attendee의 수강 진행 상태
 */
export enum AttendeeStatus {
  /** 대기중 */
  PENDING = 'pending',

  /** 진행중 */
  IN_PROGRESS = 'in_progress',

  /** 완료 */
  COMPLETED = 'completed',

  /** 기한 초과 */
  OVERDUE = 'overdue',
}
