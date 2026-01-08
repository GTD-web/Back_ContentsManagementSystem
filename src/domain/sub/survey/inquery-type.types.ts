/**
 * 설문 질문 타입 Enum
 * 
 * Survey 질문의 타입을 정의
 */
export enum InqueryType {
  /** 단답형 */
  SHORT_ANSWER = 'short_answer',

  /** 장문형 */
  PARAGRAPH = 'paragraph',

  /** 객관식 (단일 선택) */
  MULTIPLE_CHOICE = 'multiple_choice',

  /** 드롭다운 */
  DROPDOWN = 'dropdown',

  /** 체크박스 (다중 선택) */
  CHECKBOXES = 'checkboxes',

  /** 파일 업로드 */
  FILE_UPLOAD = 'file_upload',

  /** 날짜/시간 */
  DATETIME = 'datetime',

  /** 선형 척도 (1-10) */
  LINEAR_SCALE = 'linear_scale',

  /** 그리드 척도 */
  GRID_SCALE = 'grid_scale',
}
