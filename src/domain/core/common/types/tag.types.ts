/**
 * 태그 공통 타입 정의
 */

export interface Tag {
  id: string;
  name: string;
  description: string;
}

export type AnnouncementTag = Tag;

/**
 * 태그 생성
 */
export function 태그를_생성한다(
  id: string,
  name: string,
  description: string,
): Tag {
  return { id, name, description };
}
