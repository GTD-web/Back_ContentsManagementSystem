/**
 * 브로슈어 생성 커맨드
 */
export class CreateBrochureCommand {
  constructor(
    public readonly code: string,
    public readonly categoryId?: string,
    public readonly title?: string,
    public readonly content?: string,
    public readonly isPublic?: boolean,
  ) {}
}
