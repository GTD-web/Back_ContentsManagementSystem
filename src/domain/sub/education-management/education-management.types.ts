import { BaseDto } from '@libs/database/base/base.dto';
import { EmployeeDto } from '@domain/common/employee/employee.types';
import type { Attendee } from './attendee.types';

// Re-export Attendee for external use
export type { Attendee } from './attendee.types';

/**
 * 교육 관리 DTO
 */
export interface EducationManagementDto extends BaseDto {
  title: string;
  content: string;
  isPublic: boolean;
  attendees: Attendee[];
  deadline: Date;
  attachments: string[];
  manager: EmployeeDto;
  isDeadlinePassed: boolean;
}
