/**
 * 직원 삭제 커맨드
 */
export class DeleteEmployeeCommand {
  constructor(public readonly employeeId: string) {}
}
