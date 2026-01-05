/**
 * 카테고리 공통 타입 정의
 */

export interface Category {
  id: string;
  name: string;
  description: string;
}

export type AnnouncementCategory = Category;
export type ShareholdersMeetingCategory = Category;
export type ElectronicDisclosureCategory = Category;
export type IRCategory = Category;
export type BrochureCategory = Category;
export type LumirStoryCategory = Category;
export type VideoGalleryCategory = Category;
export type NewsCategory = Category;
export type SurveyCategory = Category;

/**
 * 카테고리 생성
 */
export function 카테고리를_생성한다(
  id: string,
  name: string,
  description: string,
): Category {
  return { id, name, description };
}
