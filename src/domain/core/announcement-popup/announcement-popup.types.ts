import { BaseDto } from '@libs/database/base/base.dto';
import {
  AnnouncementStatus,
  Language,
  AnnouncementCategory,
  Tag,
} from '@domain/core/common/types';
import { EmployeeDto } from '@domain/common/employee/employee.types';

/**
 * 공지사항 팝업 DTO
 */
export interface AnnouncementPopupDto extends BaseDto {
  status: AnnouncementStatus;
  title: string;
  isPublic: boolean;
  category: AnnouncementCategory;
  language: Language;
  tags: Tag[];
  manager: EmployeeDto;
  attachments: string[];
  releasedAt?: Date;
  isReleased: boolean;
}
