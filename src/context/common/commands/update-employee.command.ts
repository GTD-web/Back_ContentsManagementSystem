/**
 * 직원 수정 커맨드
 */
export class UpdateEmployeeCommand {
  constructor(
    public readonly employeeId: string,
    public readonly name?: string,
    public readonly email?: string,
    public readonly departmentId?: string,
    public readonly positionId?: string,
    public readonly rankId?: string,
    public readonly phoneNumber?: string,
    public readonly avatarUrl?: string,
  ) {}
}
