import { BaseDto } from '@libs/database/base/base.dto';
import { IRStatus, Language, IRCategory, Tag } from '@domain/core/common/types';
import { EmployeeDto } from '@domain/common/employee/employee.types';

/**
 * IR DTO
 */
export interface IRDto extends BaseDto {
  title: string;
  manager: EmployeeDto;
  language: Language;
  category: IRCategory;
  isPublic: boolean;
  status: IRStatus;
  tags: Tag[];
}
