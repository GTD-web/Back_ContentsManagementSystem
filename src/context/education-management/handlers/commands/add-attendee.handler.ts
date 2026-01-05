import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddAttendeeCommand } from '../../commands/add-attendee.command';
import { EducationManagementService } from '@business/education-management/education-management.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { Attendee } from '@domain/sub/education-management/education-management.types';

@CommandHandler(AddAttendeeCommand)
export class AddAttendeeHandler implements ICommandHandler<AddAttendeeCommand> {
  constructor(private readonly educationService: EducationManagementService) {}

  async execute(command: AddAttendeeCommand): Promise<ApiResponse<Attendee>> {
    return this.educationService.수강_직원을_추가_한다(
      command.educationId,
      command.employeeId,
      command.deadline,
    );
  }
}
