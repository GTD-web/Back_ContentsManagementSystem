/**
 * 알림 관련 타입 정의
 */

/**
 * 알림 대상자 타입
 */
export enum NotificationTargetType {
  /** 전체 */
  ALL = 'all',
  /** 부서별 */
  DEPARTMENT = 'department',
  /** 개별 직원 */
  INDIVIDUAL = 'individual',
  /** 직책별 */
  POSITION = 'position',
  /** 직급별 */
  RANK = 'rank',
}

/**
 * 알림 전송 요청 DTO
 */
export interface NotificationRequestDto {
  /** 대상자 타입 */
  targetType: NotificationTargetType;

  /** 대상자 ID 목록 (type이 ALL인 경우 빈 배열) */
  targetIds: string[];

  /** 알림 제목 */
  title: string;

  /** 알림 내용 */
  content: string;

  /** 알림 URL (선택사항) */
  url?: string;
}

/**
 * 알림 전송 응답 DTO
 */
export interface NotificationResponseDto {
  /** 전송된 알림 ID */
  notificationId: string;

  /** 전송된 대상자 수 */
  sentCount: number;

  /** 전송 실패한 대상자 수 */
  failedCount: number;

  /** 전송 시각 */
  sentAt: Date;

  /** 실패한 대상자 ID 목록 (있는 경우) */
  failedTargetIds?: string[];

  /** 실패 사유 */
  failureReasons?: Record<string, string>;
}

/**
 * 알림 엔티티
 */
export interface NotificationEntity {
  id: string;
  title: string;
  content: string;
  url?: string;
  targetType: NotificationTargetType;
  sentCount: number;
  failedCount: number;
  sentAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
