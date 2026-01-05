/**
 * 공지사항 목록 조회 쿼리
 */
export class GetAllAnnouncementsQuery {
  constructor(public readonly filters?: {
    categoryId?: string;
    isFixed?: boolean;
    mustRead?: boolean;
  }) {}
}
