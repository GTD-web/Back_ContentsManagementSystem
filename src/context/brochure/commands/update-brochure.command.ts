/**
 * 브로슈어 수정 커맨드
 */
export class UpdateBrochureCommand {
  constructor(
    public readonly brochureId: string,
    public readonly categoryId?: string,
    public readonly title?: string,
    public readonly content?: string,
    public readonly isPublic?: boolean,
  ) {}
}
