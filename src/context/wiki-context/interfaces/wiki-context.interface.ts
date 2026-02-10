import { WikiFileSystem } from '@domain/sub/wiki-file-system/wiki-file-system.entity';
import {
  CreateFolderDto as BaseCreateFolderDto,
  CreateFileDto as BaseCreateFileDto,
  UpdateFolderDto as BaseUpdateFolderDto,
  UpdateFileDto as BaseUpdateFileDto,
  UpdateWikiPublicDto as BaseUpdateWikiPublicDto,
  UpdateFilePublicDto as BaseUpdateFilePublicDto,
  UpdateWikiPathDto as BaseUpdateWikiPathDto,
} from '@interface/common/dto/wiki/wiki.dto';

/**
 * 폴더 생성 DTO (Context Layer용 - createdBy 포함)
 */
export interface CreateFolderDto extends BaseCreateFolderDto {
  createdBy?: string;
}

/**
 * 파일 생성 DTO (Context Layer용 - createdBy, 추가 필드 포함)
 */
export interface CreateFileDto extends BaseCreateFileDto {
  fileUrl?: string | null;
  fileSize?: number | null;
  mimeType?: string | null;
  attachments?: Array<{
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    deletedAt?: Date | null;
  }> | null;
  permissionRankIds?: string[] | null;
  permissionPositionIds?: string[] | null;
  createdBy?: string;
}

/**
 * 위키 수정 DTO (Context Layer용 - updatedBy 포함)
 */
export interface UpdateWikiDto {
  name?: string;
  title?: string | null;
  content?: string | null;
  isPublic?: boolean;
  permissionRankIds?: string[] | null;
  permissionPositionIds?: string[] | null;
  permissionDepartmentIds?: string[] | null;
  order?: number;
  updatedBy?: string;
}

/**
 * 위키 파일 수정 DTO (Context Layer용)
 */
export interface UpdateWikiFileDto {
  fileUrl?: string | null;
  fileSize?: number | null;
  mimeType?: string | null;
  attachments?: Array<{
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    deletedAt?: Date | null;
  }> | null;
  updatedBy?: string;
}

/**
 * 위키 공개 수정 DTO (Context Layer용 - updatedBy 포함)
 */
export interface UpdateWikiPublicDto extends BaseUpdateWikiPublicDto {
  updatedBy?: string;
}

/**
 * 위키 경로 수정 DTO (Context Layer용 - updatedBy 포함)
 */
export interface UpdateWikiPathDto extends BaseUpdateWikiPathDto {
  updatedBy?: string;
}

/**
 * 폴더 구조 결과
 */
export interface FolderStructureResult {
  wiki: WikiFileSystem;
  depth: number;
  children?: FolderStructureResult[];
}

/**
 * 생성 결과
 */
export interface CreateWikiResult {
  id: string;
  name: string;
  type: string;
}
