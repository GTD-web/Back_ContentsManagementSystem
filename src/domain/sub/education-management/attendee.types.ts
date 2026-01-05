/**
 * 수강 직원 상태
 */
export enum AttendeeStatus {
  PENDING = 'pending', // 대기중
  IN_PROGRESS = 'in_progress', // 진행중
  COMPLETED = 'completed', // 완료
  OVERDUE = 'overdue', // 기한 초과
}

/**
 * 수강 직원 정보
 */
export interface Attendee {
  id: string;
  name: string;
  status: AttendeeStatus;
  completedAt?: Date;
  deadline: Date;
}

/**
 * 수강 직원을 생성한다
 */
export function 수강직원을_생성한다(
  id: string,
  name: string,
  deadline: Date,
): Attendee {
  return {
    id,
    name,
    status: AttendeeStatus.PENDING,
    deadline,
  };
}
