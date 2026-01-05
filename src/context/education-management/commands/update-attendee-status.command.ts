export class UpdateAttendeeStatusCommand {
  constructor(
    public readonly educationId: string,
    public readonly employeeId: string,
    public readonly status: string,
    public readonly completedAt?: Date,
  ) {}
}
