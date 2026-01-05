import { BaseDto } from '@libs/database/base/base.dto';
import { NewsStatus, NewsCategory, Tag } from '@domain/core/common/types';
import { EmployeeDto } from '@domain/common/employee/employee.types';

/**
 * 뉴스 DTO
 */
export interface NewsDto extends BaseDto {
  title: string;
  manager: EmployeeDto;
  category: NewsCategory;
  isPublic: boolean;
  status: NewsStatus;
  tags: Tag[];
}
