import { BaseDto } from '@libs/database/base/base.dto';
import {
  VideoGalleryStatus,
  VideoGalleryCategory,
  Tag,
} from '@domain/core/common/types';
import { EmployeeDto } from '@domain/common/employee/employee.types';

/**
 * 비디오 갤러리 DTO
 */
export interface VideoGalleryDto extends BaseDto {
  title: string;
  manager: EmployeeDto;
  category: VideoGalleryCategory;
  isPublic: boolean;
  status: VideoGalleryStatus;
  tags: Tag[];
}
