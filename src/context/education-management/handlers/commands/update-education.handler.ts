import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateEducationCommand } from '../../commands/update-education.command';
import { EducationManagementService } from '@business/education-management/education-management.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { EducationManagementDto } from '@domain/sub/education-management/education-management.types';

@CommandHandler(UpdateEducationCommand)
export class UpdateEducationHandler
  implements ICommandHandler<UpdateEducationCommand>
{
  constructor(private readonly educationService: EducationManagementService) {}

  async execute(
    command: UpdateEducationCommand,
  ): Promise<ApiResponse<EducationManagementDto>> {
    return this.educationService.교육을_수정_한다(command.educationId, {
      title: command.title,
      content: command.content,
      deadline: command.deadline,
      isPublic: command.isPublic,
    } as any);
  }
}
