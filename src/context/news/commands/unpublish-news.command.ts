/**
 * 뉴스 비공개 커맨드
 */
export class UnpublishNewsCommand {
  constructor(public readonly newsId: string) {}
}
