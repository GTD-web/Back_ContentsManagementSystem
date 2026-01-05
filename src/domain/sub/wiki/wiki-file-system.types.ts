/**
 * 위키 파일 시스템 타입
 */
export enum WikiFileSystemType {
  FOLDER = 'folder',
  FILE = 'file',
}

/**
 * 위키 파일 시스템 인터페이스
 */
export interface WikiFileSystem {
  id: string;
  name: string;
  type: WikiFileSystemType;
  parentId: string | null;
  children?: WikiFileSystem[];
  updatedAt: Date;
  createdAt: Date;
  visibility: boolean;
  ownerId: string;
}

/**
 * 위키 폴더를 생성한다
 */
export function 위키_폴더를_생성한다(
  id: string,
  name: string,
  ownerId: string,
  parentId: string | null = null,
): WikiFileSystem {
  return {
    id,
    name,
    type: WikiFileSystemType.FOLDER,
    parentId,
    children: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    visibility: true,
    ownerId,
  };
}

/**
 * 위키 파일을 생성한다
 */
export function 위키_파일을_생성한다(
  id: string,
  name: string,
  ownerId: string,
  parentId: string | null = null,
): WikiFileSystem {
  return {
    id,
    name,
    type: WikiFileSystemType.FILE,
    parentId,
    createdAt: new Date(),
    updatedAt: new Date(),
    visibility: true,
    ownerId,
  };
}
