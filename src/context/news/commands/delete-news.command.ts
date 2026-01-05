/**
 * 뉴스 삭제 커맨드
 */
export class DeleteNewsCommand {
  constructor(public readonly newsId: string) {}
}
