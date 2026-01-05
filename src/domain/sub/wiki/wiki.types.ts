import { BaseDto } from '@libs/database/base/base.dto';
import { WikiFileSystem } from './wiki-file-system.types';

/**
 * 위키 DTO
 */
export interface WikiDto extends BaseDto {
  title: string;
  content: string;
  fileSystem: WikiFileSystem;
  isPublic: boolean;
  ownerId: string;
  tags: string[];
}
