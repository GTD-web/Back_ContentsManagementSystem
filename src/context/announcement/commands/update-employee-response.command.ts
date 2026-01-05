/**
 * 직원 응답 업데이트 커맨드
 */
export class UpdateEmployeeResponseCommand {
  constructor(
    public readonly announcementId: string,
    public readonly employeeId: string,
    public readonly isRead?: boolean,
    public readonly isSubmitted?: boolean,
    public readonly responseMessage?: string,
  ) {}
}
