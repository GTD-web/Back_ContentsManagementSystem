import { BaseDto } from '@libs/database/base/base.dto';
import {
  BrochureStatus,
  Language,
  BrochureCategory,
  Tag,
} from '@domain/core/common/types';
import { EmployeeDto } from '@domain/common/employee/employee.types';

/**
 * 브로슈어 DTO
 */
export interface BrochureDto extends BaseDto {
  title: string;
  manager: EmployeeDto;
  language: Language;
  category: BrochureCategory;
  isPublic: boolean;
  status: BrochureStatus;
  tags: Tag[];
}
