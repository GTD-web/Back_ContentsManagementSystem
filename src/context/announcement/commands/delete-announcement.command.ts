/**
 * 공지사항 삭제 커맨드
 */
export class DeleteAnnouncementCommand {
  constructor(public readonly announcementId: string) {}
}
