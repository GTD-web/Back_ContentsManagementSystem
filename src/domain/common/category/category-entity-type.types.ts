/**
 * 카테고리 엔티티 타입 Enum
 * 
 * Category가 어떤 도메인의 엔티티인지 구분
 */
export enum CategoryEntityType {
  /** 공지사항 */
  ANNOUNCEMENT = 'announcement',

  /** 메인 팝업 */
  MAIN_POPUP = 'main_popup',

  /** 주주총회 */
  SHAREHOLDERS_MEETING = 'shareholders_meeting',

  /** 전자공시 */
  ELECTRONIC_DISCLOSURE = 'electronic_disclosure',

  /** IR 자료 */
  IR = 'ir',

  /** 브로슈어 */
  BROCHURE = 'brochure',

  /** 루미르 스토리 */
  LUMIR_STORY = 'lumir_story',

  /** 비디오 갤러리 */
  VIDEO_GALLERY = 'video_gallery',

  /** 뉴스 */
  NEWS = 'news',

  /** 교육 관리 */
  EDUCATION_MANAGEMENT = 'education_management',
}
