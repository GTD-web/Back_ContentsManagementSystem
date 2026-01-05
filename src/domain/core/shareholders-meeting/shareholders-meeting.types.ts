import { BaseDto } from '@libs/database/base/base.dto';
import {
  Language,
  ShareholdersMeetingCategory,
  Tag,
} from '@domain/core/common/types';
import { EmployeeDto } from '@domain/common/employee/employee.types';
import { ResultOfVote } from './vote-result.types';

/**
 * 주주총회 DTO
 */
export interface ShareholdersMeetingDto extends BaseDto {
  resultOfVote: ResultOfVote;
  title: string;
  resultText: string;
  summary: string;
  language: Language;
  category: ShareholdersMeetingCategory;
  isPublic: boolean;
  location: string;
  meetingDate: Date;
  manager: EmployeeDto;
  releasedAt?: Date;
  attachments: string[];
  tags: Tag[];
  isReleased: boolean;
  isMeetingPassed: boolean;
}
