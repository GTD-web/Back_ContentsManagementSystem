import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteEmployeeCommand } from '../../commands/delete-employee.command';
import { EmployeeService } from '@business/common/employee.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';

/**
 * 직원 삭제 커맨드 핸들러
 */
@CommandHandler(DeleteEmployeeCommand)
export class DeleteEmployeeHandler
  implements ICommandHandler<DeleteEmployeeCommand>
{
  constructor(private readonly employeeService: EmployeeService) {}

  async execute(command: DeleteEmployeeCommand): Promise<ApiResponse<void>> {
    return this.employeeService.직원을_삭제_한다(command.employeeId);
  }
}
