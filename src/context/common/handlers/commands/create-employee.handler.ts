import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateEmployeeCommand } from '../../commands/create-employee.command';
import { EmployeeService } from '@business/common/employee.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { EmployeeDto } from '@domain/common/employee/employee.types';

/**
 * 직원 생성 커맨드 핸들러
 */
@CommandHandler(CreateEmployeeCommand)
export class CreateEmployeeHandler
  implements ICommandHandler<CreateEmployeeCommand>
{
  constructor(private readonly employeeService: EmployeeService) {}

  async execute(
    command: CreateEmployeeCommand,
  ): Promise<ApiResponse<EmployeeDto>> {
    return this.employeeService.직원을_생성_한다({
      name: command.name,
      email: command.email,
      departmentId: command.departmentId,
      positionId: command.positionId,
      rankId: command.rankId,
      phoneNumber: command.phoneNumber,
      avatarUrl: command.avatarUrl,
    } as any);
  }
}
