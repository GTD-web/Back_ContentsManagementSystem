/**
 * 직원 추가 커맨드
 */
export class AddEmployeeCommand {
  constructor(
    public readonly announcementId: string,
    public readonly employeeId: string,
  ) {}
}
