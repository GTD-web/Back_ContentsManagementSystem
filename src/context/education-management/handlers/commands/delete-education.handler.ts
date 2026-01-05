import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteEducationCommand } from '../../commands/delete-education.command';
import { EducationManagementService } from '@business/education-management/education-management.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';

@CommandHandler(DeleteEducationCommand)
export class DeleteEducationHandler
  implements ICommandHandler<DeleteEducationCommand>
{
  constructor(private readonly educationService: EducationManagementService) {}

  async execute(command: DeleteEducationCommand): Promise<ApiResponse<void>> {
    return this.educationService.교육을_삭제_한다(command.educationId);
  }
}
