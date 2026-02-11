/**
 * 백업 타입 정의
 */

export enum BackupType {
  FOUR_HOURLY = 'four_hourly', // 4시간 백업
  DAILY = 'daily', // 일간 백업
  WEEKLY = 'weekly', // 주간 백업
  MONTHLY = 'monthly', // 월간 백업
  QUARTERLY = 'quarterly', // 분기 백업
  YEARLY = 'yearly', // 연간 백업
}

/**
 * 백업 보관 기간 (밀리초)
 * 
 * GFS 백업 전략에 따른 보관 기간 및 최대 파일 개수:
 * - 4시간 백업: 3일 보관 (하루 6개 × 3일 = 최대 18개)
 * - 일간 백업: 10일 보관 (하루 1개 × 10일 = 최대 10개)
 * - 주간 백업: 63일 보관 (주 1개 × 9주 = 최대 9개)
 * - 월간 백업: 180일 보관 (월 1개 × 6개월 = 최대 6개)
 * - 분기 백업: 365일 보관 (분기 1개 × 4분기 = 최대 4개)
 * - 연간 백업: 1095일 보관 (연 1개 × 3년 = 최대 3개)
 * 
 * 총 최대 파일 개수: 약 50개
 */
export const BACKUP_RETENTION: Record<BackupType, number> = {
  [BackupType.FOUR_HOURLY]: 3 * 24 * 60 * 60 * 1000, // 3일 (최대 18개)
  [BackupType.DAILY]: 10 * 24 * 60 * 60 * 1000, // 10일 (최대 10개)
  [BackupType.WEEKLY]: 63 * 24 * 60 * 60 * 1000, // 63일 (최대 9개)
  [BackupType.MONTHLY]: 180 * 24 * 60 * 60 * 1000, // 180일 (최대 6개)
  [BackupType.QUARTERLY]: 365 * 24 * 60 * 60 * 1000, // 365일 (최대 4개)
  [BackupType.YEARLY]: 1095 * 24 * 60 * 60 * 1000, // 1095일 (최대 3개)
};

/**
 * 백업 설정
 */
export interface BackupConfig {
  enabled: boolean;
  path: string;
  maxRetries: number;
  retryDelayMs: number;
  compress: boolean;
}

/**
 * 백업 결과
 */
export interface BackupResult {
  success: boolean;
  type: BackupType;
  filename: string;
  path: string;
  size: number;
  originalSize?: number;
  compressionRatio?: number;
  timestamp: Date;
  error?: string;
}

/**
 * 백업 메타데이터
 */
export interface BackupMetadata {
  type: BackupType;
  filename: string;
  createdAt: Date;
  expiresAt: Date;
}
