import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAttendeeStatusCommand } from '../../commands/update-attendee-status.command';
import { EducationManagementService } from '@business/education-management/education-management.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { Attendee } from '@domain/sub/education-management/education-management.types';

@CommandHandler(UpdateAttendeeStatusCommand)
export class UpdateAttendeeStatusHandler
  implements ICommandHandler<UpdateAttendeeStatusCommand>
{
  constructor(private readonly educationService: EducationManagementService) {}

  async execute(
    command: UpdateAttendeeStatusCommand,
  ): Promise<ApiResponse<Attendee>> {
    return this.educationService.수강_상태를_업데이트_한다(
      command.educationId,
      command.employeeId,
      command.status,
    );
  }
}
