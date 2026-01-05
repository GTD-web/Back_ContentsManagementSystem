/**
 * 공지사항 읽은 직원 정보
 */
export interface AnnouncementEmployee {
  id: string;
  name: string;
  isRead: boolean;
  isSubmitted: boolean;
  submittedAt?: Date;
  readAt?: Date;
  responseMessage?: string;
}

/**
 * 공지사항 직원 정보를 생성한다
 */
export function 공지사항_직원을_생성한다(
  id: string,
  name: string,
): AnnouncementEmployee {
  return {
    id,
    name,
    isRead: false,
    isSubmitted: false,
  };
}
