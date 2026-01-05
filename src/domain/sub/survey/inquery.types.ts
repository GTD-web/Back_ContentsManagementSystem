import { EmployeeDto } from '@domain/common/employee/employee.types';

/**
 * 질문 타입
 */
export enum InqueryType {
  SHORT_ANSWER = 'short_answer', // 단답형
  PARAGRAPH = 'paragraph', // 장문형
  MULTIPLE_CHOICE = 'multiple_choice', // 객관식
  DROPDOWN = 'dropdown', // 드롭다운
  CHECKBOXES = 'checkboxes', // 체크박스
  FILE_UPLOAD = 'file_upload', // 파일 업로드
  DATETIME = 'datetime', // 날짜/시간
  LINEAR_SCALE = 'linear_scale', // 선형 척도
  GRID_SCALE = 'grid_scale', // 그리드 척도
}

/**
 * 질문 응답 데이터 타입
 */
export type InqueryResponseData =
  | string // 단답형, 장문형, 객관식, 드롭다운
  | string[] // 체크박스, 파일 업로드
  | number // 선형 척도
  | Record<string, string> // 그리드 (행-열 매핑)
  | Record<string, string[]>; // 체크박스 그리드 (행-열 매핑)

/**
 * 질문 폼 데이터 타입
 */
export type InqueryFormData =
  | Map<string, string>
  | Map<string, string[]>
  | Map<string, number>
  | Map<string, Record<string, string>>
  | Map<string, Record<string, string[]>>;

/**
 * 질문 응답
 */
export interface InqueryResponse {
  employee: EmployeeDto;
  response: InqueryResponseData;
}

/**
 * 질문
 */
export interface Inquery {
  id: string;
  title: string;
  type: InqueryType;
  form: InqueryFormData;
  isRequired: boolean;
  responses: InqueryResponse[];
}
