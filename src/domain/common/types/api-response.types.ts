/**
 * API 공통 응답 타입
 */

/**
 * API 응답 래퍼
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: Date;
}

/**
 * 페이지네이션 메타데이터
 */
export interface PaginationMeta {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * 페이지네이션된 응답
 */
export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

/**
 * 성공 응답 헬퍼
 */
export function successResponse<T>(
  data: T,
  message?: string,
): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    timestamp: new Date(),
  };
}

/**
 * 에러 응답 헬퍼
 */
export function errorResponse<T = null>(
  code: string,
  message: string,
  details?: unknown,
): ApiResponse<T> {
  return {
    success: false,
    data: null as T,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date(),
  };
}
