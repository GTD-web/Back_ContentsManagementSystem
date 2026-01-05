import { BaseDto } from '@libs/database/base/base.dto';
import {
  ElectronicDisclosureStatus,
  Language,
  ElectronicDisclosureCategory,
  Tag,
} from '@domain/core/common/types';
import { EmployeeDto } from '@domain/common/employee/employee.types';

/**
 * 전자공시 DTO
 */
export interface ElectronicDisclosureDto extends BaseDto {
  title: string;
  manager: EmployeeDto;
  language: Language;
  category: ElectronicDisclosureCategory;
  isPublic: boolean;
  status: ElectronicDisclosureStatus;
  tags: Tag[];
}
