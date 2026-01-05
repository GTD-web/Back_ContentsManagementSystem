import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateEducationCommand } from '../../commands/create-education.command';
import { EducationManagementService } from '@business/education-management/education-management.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { EducationManagementDto } from '@domain/sub/education-management/education-management.types';

@CommandHandler(CreateEducationCommand)
export class CreateEducationHandler
  implements ICommandHandler<CreateEducationCommand>
{
  constructor(private readonly educationService: EducationManagementService) {}

  async execute(
    command: CreateEducationCommand,
  ): Promise<ApiResponse<EducationManagementDto>> {
    return this.educationService.교육을_생성_한다({
      title: command.title,
      content: command.content,
      deadline: command.deadline,
      isPublic: command.isPublic,
    } as any);
  }
}
