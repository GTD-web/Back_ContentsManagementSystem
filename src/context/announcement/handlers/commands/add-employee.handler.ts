import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddEmployeeCommand } from '../../commands/add-employee.command';
import { AnnouncementService } from '@business/announcement/announcement.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { AnnouncementDto } from '@domain/core/announcement/announcement.types';

@CommandHandler(AddEmployeeCommand)
export class AddEmployeeHandler implements ICommandHandler<AddEmployeeCommand> {
  constructor(private readonly announcementService: AnnouncementService) {}

  async execute(
    command: AddEmployeeCommand,
  ): Promise<ApiResponse<AnnouncementDto>> {
    return this.announcementService.직원을_추가_한다(
      command.announcementId,
      command.employeeId,
    );
  }
}
