import { BaseDto } from '@libs/database/base/base.dto';
import { SurveyStatus, SurveyCategory } from '@domain/core/common/types';
import { EmployeeDto } from '@domain/common/employee/employee.types';
import { Inquery } from './inquery.types';

/**
 * 설문조사 DTO
 */
export interface SurveyDto extends BaseDto {
  title: string;
  category: SurveyCategory;
  manager: EmployeeDto;
  description: string;
  inqueries: Inquery[];
  status: SurveyStatus;
}
