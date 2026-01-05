/**
 * 기본 DTO 인터페이스
 *
 * 모든 DTO가 공통으로 가져야 하는 필드들을 정의합니다.
 */
export interface BaseDto {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null; // null 허용
  createdBy?: string;
  updatedBy?: string;
  version?: number;

  // 계산된 필드들
  isDeleted?: boolean;
  isNew?: boolean;
}
