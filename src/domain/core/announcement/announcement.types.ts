import { BaseDto } from '@libs/database/base/base.dto';
import {
  AnnouncementStatus,
  AnnouncementCategory,
} from '@domain/core/common/types';
import { EmployeeDto } from '@domain/common/employee/employee.types';
import { AnnouncementEmployee } from './announcement-employee.types';

/**
 * 공지사항 DTO
 */
export interface AnnouncementDto extends BaseDto {
  title: string;
  content: string;
  isFixed: boolean;
  category: AnnouncementCategory;
  releasedAt?: Date;
  expiredAt?: Date;
  mustRead: boolean;
  manager: EmployeeDto;
  status: AnnouncementStatus;
  hits: number;
  attachments: string[];
  employees: AnnouncementEmployee[];
  isReleased: boolean;
  isExpired: boolean;
}
