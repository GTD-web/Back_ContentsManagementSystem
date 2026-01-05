import { BaseDto } from '@libs/database/base/base.dto';
import {
  LumirStoryStatus,
  LumirStoryCategory,
  Tag,
} from '@domain/core/common/types';
import { EmployeeDto } from '@domain/common/employee/employee.types';

/**
 * 루미르 스토리 DTO
 */
export interface LumirStoryDto extends BaseDto {
  title: string;
  manager: EmployeeDto;
  category: LumirStoryCategory;
  isPublic: boolean;
  status: LumirStoryStatus;
  tags: Tag[];
}
