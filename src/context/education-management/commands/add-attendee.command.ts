export class AddAttendeeCommand {
  constructor(
    public readonly educationId: string,
    public readonly employeeId: string,
    public readonly deadline: Date,
  ) {}
}
