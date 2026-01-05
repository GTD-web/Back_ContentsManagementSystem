/**
 * 뉴스 수정 커맨드
 */
export class UpdateNewsCommand {
  constructor(
    public readonly newsId: string,
    public readonly categoryId?: string,
    public readonly title?: string,
    public readonly content?: string,
    public readonly isPublic?: boolean,
  ) {}
}
