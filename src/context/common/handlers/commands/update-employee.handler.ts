import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateEmployeeCommand } from '../../commands/update-employee.command';
import { EmployeeService } from '@business/common/employee.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { EmployeeDto } from '@domain/common/employee/employee.types';

/**
 * 직원 수정 커맨드 핸들러
 */
@CommandHandler(UpdateEmployeeCommand)
export class UpdateEmployeeHandler
  implements ICommandHandler<UpdateEmployeeCommand>
{
  constructor(private readonly employeeService: EmployeeService) {}

  async execute(
    command: UpdateEmployeeCommand,
  ): Promise<ApiResponse<EmployeeDto>> {
    return this.employeeService.직원을_수정_한다(command.employeeId, {
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
