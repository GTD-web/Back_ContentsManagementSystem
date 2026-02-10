import { Injectable, Logger, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, QueryFailedError, DataSource } from 'typeorm';
import { WikiContextService } from '@context/wiki-context/wiki-context.service';
import { CompanyContextService } from '@context/company-context/company-context.service';
import { WikiFileSystem } from '@domain/sub/wiki-file-system/wiki-file-system.entity';
import { WikiPermissionLog } from '@domain/sub/wiki-file-system/wiki-permission-log.entity';
import { WikiPermissionAction } from '@domain/sub/wiki-file-system/wiki-permission-action.types';
import { STORAGE_SERVICE } from '@libs/storage/storage.module';
import type { IStorageService } from '@libs/storage/interfaces/storage.interface';
import { ReplaceWikiPermissionsDto } from '@interface/admin/wiki/dto/replace-wiki-permissions.dto';

/**
 * Wiki 비즈니스 서비스
 *
 * Wiki 파일 시스템 관련 비즈니스 로직을 오케스트레이션합니다.
 * - 컨텍스트 서비스 호출
 * - 파일 업로드/삭제 처리
 */
@Injectable()
export class WikiBusinessService {
  private readonly logger = new Logger(WikiBusinessService.name);

  constructor(
    private readonly wikiContextService: WikiContextService,
    private readonly companyContextService: CompanyContextService,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: IStorageService,
    @InjectRepository(WikiPermissionLog)
    private readonly permissionLogRepository: Repository<WikiPermissionLog>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  /**
   * 폴더를 조회한다
   */
  async 폴더를_조회한다(
    id: string,
    includeTargetEmployees: boolean = false,
  ): Promise<any> {
    this.logger.log(`폴더 조회 시작 - ID: ${id}`);

    const wiki = await this.wikiContextService.위키_상세를_조회한다(id);

    this.logger.log(`폴더 조회 완료 - ID: ${id}`);

    const result: any = { ...wiki };

    // 대상 직원 정보 포함 옵션이 true면 추가
    if (includeTargetEmployees) {
      const targetEmployeesList =
        await this.위키_대상_직원_상세_정보를_조회한다(wiki);
      result.recipients = {
        total: targetEmployeesList.length,
        employees: targetEmployeesList,
      };
    }

    return result;
  }

  /**
   * 경로로 폴더를 조회한다
   */
  async 경로로_폴더를_조회한다(path: string): Promise<WikiFileSystem> {
    this.logger.log(`경로로 폴더 조회 시작 - 경로: ${path}`);

    const wiki = await this.wikiContextService.경로로_폴더를_조회한다(path);

    this.logger.log(`경로로 폴더 조회 완료 - 경로: ${path}, ID: ${wiki.id}`);

    return wiki;
  }

  /**
   * 폴더의 하위 항목을 조회한다
   */
  async 폴더_하위_항목을_조회한다(folderId: string): Promise<WikiFileSystem[]> {
    this.logger.log(`폴더 하위 항목 조회 시작 - 폴더 ID: ${folderId}`);

    const children = await this.wikiContextService.폴더_자식들을_조회한다(folderId);

    this.logger.log(`폴더 하위 항목 조회 완료 - 총 ${children.length}개`);

    return children;
  }

  /**
   * 폴더 공개를 수정한다
   */
  async 폴더_공개를_수정한다(
    id: string,
    data: {
      isPublic: boolean;
      updatedBy?: string;
    },
  ): Promise<WikiFileSystem> {
    this.logger.log(`폴더 공개 수정 시작 - ID: ${id}`);

    const result = await this.wikiContextService.위키_공개를_수정한다(id, data);

    this.logger.log(`폴더 공개 수정 완료 - ID: ${id}`);

    return result;
  }

  /**
   * 폴더를 생성한다
   */
  async 폴더를_생성한다(data: {
    name: string;
    parentId?: string | null;
    isPublic?: boolean;
    permissionRankIds?: string[];
    permissionPositionIds?: string[];
    permissionDepartmentIds?: string[];
    order?: number;
    createdBy?: string;
  }): Promise<WikiFileSystem> {
    this.logger.log(`폴더 생성 시작 - 이름: ${data.name}`);

    // parentId가 없으면 null로 설정 (최상위 폴더)
    const result = await this.wikiContextService.폴더를_생성한다({
      ...data,
      parentId: data.parentId || null,
    });

    const folder = await this.wikiContextService.위키_상세를_조회한다(result.id);

    this.logger.log(`폴더 생성 완료 - ID: ${folder.id}`);

    return folder;
  }

  /**
   * 폴더를 삭제한다 (하위 항목 포함)
   */
  async 폴더를_삭제한다(id: string): Promise<boolean> {
    this.logger.log(`폴더 삭제 시작 - ID: ${id}`);

    const result = await this.wikiContextService.위키를_삭제한다(id);

    this.logger.log(`폴더 삭제 완료 - ID: ${id}`);

    return result;
  }

  /**
   * 폴더만 삭제한다 (하위 항목이 있으면 실패)
   */
  async 폴더만_삭제한다(id: string): Promise<boolean> {
    this.logger.log(`폴더만 삭제 시작 - ID: ${id}`);

    const result = await this.wikiContextService.폴더만_삭제한다(id);

    this.logger.log(`폴더만 삭제 완료 - ID: ${id}`);

    return result;
  }

  /**
   * 폴더를 수정한다
   */
  async 폴더를_수정한다(
    id: string,
    data: {
      name?: string;
      isPublic?: boolean;
      permissionRankIds?: string[];
      permissionPositionIds?: string[];
      permissionDepartmentIds?: string[];
      order?: number;
      updatedBy?: string;
    },
  ): Promise<WikiFileSystem> {
    this.logger.log(`폴더 수정 시작 - ID: ${id}`);

    const result = await this.wikiContextService.위키를_수정한다(id, data);

    this.logger.log(`폴더 수정 완료 - ID: ${id}`);

    return result;
  }

  /**
   * 폴더 경로를 수정한다
   */
  async 폴더_경로를_수정한다(
    id: string,
    data: {
      parentId: string | null;
      updatedBy?: string;
    },
  ): Promise<WikiFileSystem> {
    this.logger.log(`폴더 경로 수정 시작 - ID: ${id}`);

    const result = await this.wikiContextService.위키_경로를_수정한다(id, data);

    this.logger.log(`폴더 경로 수정 완료 - ID: ${id}`);

    return result;
  }

  /**
   * 폴더 이름을 수정한다
   */
  async 폴더_이름을_수정한다(
    id: string,
    data: {
      name: string;
      updatedBy?: string;
    },
  ): Promise<WikiFileSystem> {
    this.logger.log(`폴더 이름 수정 시작 - ID: ${id}`);

    const result = await this.wikiContextService.위키를_수정한다(id, data);

    this.logger.log(`폴더 이름 수정 완료 - ID: ${id}`);

    return result;
  }

  /**
   * 폴더 구조를 가져온다 (모든 하위 항목 포함)
   */
  async 폴더_구조를_가져온다(
    ancestorId?: string,
    excludeRoot: boolean = false,
  ): Promise<WikiFileSystem[]> {
    this.logger.log(`폴더 구조 조회 시작 - 조상 ID: ${ancestorId || '최상위 (모든 항목)'}, 루트 제외: ${excludeRoot}`);

    let result: WikiFileSystem[];

    if (ancestorId) {
      // 특정 폴더의 하위 구조 조회
      const structure = await this.wikiContextService.폴더_구조를_조회한다(
        ancestorId,
      );
      result = structure.map((s) => s.wiki);
    } else {
      // 최상위부터 전체 구조 조회 - 모든 wiki 항목 가져오기
      result = await this.wikiContextService.모든_위키를_조회한다();
    }

    // excludeRoot는 이제 사용하지 않음 (parentId: null인 폴더가 최상위 폴더이므로 제외할 필요 없음)
    // 파라미터는 하위 호환성을 위해 남겨둠

    // 각 항목에 경로 정보 추가
    const itemsWithPath = await Promise.all(
      result.map(async (item) => {
        const pathInfo = await this.위키_경로_정보를_가져온다(item.id);
        // WikiFileSystem 객체에 path와 pathIds를 임시로 추가
        (item as any).path = pathInfo.path;
        (item as any).pathIds = pathInfo.pathIds;
        return item;
      })
    );

    this.logger.log(`폴더 구조 조회 완료 - 총 ${itemsWithPath.length}개`);

    return itemsWithPath;
  }

  /**
   * 위키 항목의 경로를 조회한다 (Breadcrumb)
   */
  async 위키_경로를_조회한다(wikiId: string): Promise<WikiFileSystem[]> {
    this.logger.log(`위키 경로 조회 시작 - Wiki ID: ${wikiId}`);

    // parentId를 직접 따라가는 방식으로 변경
    const breadcrumb = await this.wikiContextService.위키_경로를_직접_조회한다(wikiId);

    this.logger.log(`위키 경로 조회 완료 - 총 ${breadcrumb.length}개`);

    return breadcrumb;
  }

  /**
   * 위키 항목의 경로 정보를 가져온다 (부모 폴더들의 이름과 ID)
   */
  private async 위키_경로_정보를_가져온다(
    wikiId: string,
  ): Promise<{ path: string[]; pathIds: string[] }> {
    try {
      // parentId를 직접 따라가는 방식으로 변경
      const breadcrumb = await this.wikiContextService.위키_경로를_직접_조회한다(wikiId);
      
      // breadcrumb은 자신을 포함하므로, 자신을 제외하고 부모들만 추출
      const parents = breadcrumb.filter(item => item.id !== wikiId);
      
      const path = parents.map(item => item.name);
      const pathIds = parents.map(item => item.id);
      
      return { path, pathIds };
    } catch (error) {
      this.logger.warn(`경로 정보 조회 실패 - Wiki ID: ${wikiId}, 에러: ${error.message}`);
      return { path: [], pathIds: [] };
    }
  }

  /**
   * 파일을 삭제한다
   */
  async 파일을_삭제한다(id: string): Promise<boolean> {
    this.logger.log(`파일 삭제 시작 - ID: ${id}`);

    // 1. 파일 정보 조회
    const file = await this.wikiContextService.위키_상세를_조회한다(id);

    // 2. S3에서 파일 삭제
    const filesToDelete: string[] = [];

    if (file.fileUrl) {
      filesToDelete.push(file.fileUrl);
    }

    if (file.attachments && file.attachments.length > 0) {
      filesToDelete.push(...file.attachments.map((a) => a.fileUrl));
    }

    if (filesToDelete.length > 0) {
      this.logger.log(`S3에서 ${filesToDelete.length}개의 파일 삭제 시작`);
      await this.storageService.deleteFiles(filesToDelete);
      this.logger.log(`S3 파일 삭제 완료`);
    }

    // 3. DB에서 삭제
    const result = await this.wikiContextService.위키를_삭제한다(id);

    this.logger.log(`파일 삭제 완료 - ID: ${id}`);

    return result;
  }

  /**
   * 파일 경로를 수정한다
   */
  async 파일_경로를_수정한다(
    id: string,
    data: {
      parentId: string | null;
      updatedBy?: string;
    },
  ): Promise<WikiFileSystem> {
    this.logger.log(`파일 경로 수정 시작 - ID: ${id}`);

    const result = await this.wikiContextService.위키_경로를_수정한다(id, data);

    this.logger.log(`파일 경로 수정 완료 - ID: ${id}`);

    return result;
  }

  /**
   * 파일 공개를 수정한다
   */
  async 파일_공개를_수정한다(
    id: string,
    data: {
      isPublic: boolean;
      updatedBy?: string;
    },
  ): Promise<WikiFileSystem> {
    this.logger.log(`파일 공개 수정 시작 - ID: ${id}`);

    const result = await this.wikiContextService.위키를_수정한다(id, {
      isPublic: data.isPublic,
      updatedBy: data.updatedBy,
    });

    this.logger.log(`파일 공개 수정 완료 - ID: ${id}`);

    return result;
  }

  /**
   * 파일들을 조회한다
   */
  async 파일들을_조회한다(parentId: string | null): Promise<WikiFileSystem[]> {
    this.logger.log(
      `파일 목록 조회 시작 - 부모 ID: ${parentId || '루트'}`,
    );

    const result = await this.wikiContextService.폴더_자식들을_조회한다(parentId);

    this.logger.log(`파일 목록 조회 완료 - 총 ${result.length}개`);

    return result;
  }

  /**
   * 파일들을 검색한다
   */
  async 파일들을_검색한다(
    query: string,
  ): Promise<Array<{ wiki: WikiFileSystem; path: Array<{ wiki: WikiFileSystem; depth: number }> }>> {
    this.logger.log(`파일 검색 시작 - 검색어: ${query}`);

    const result = await this.wikiContextService.위키를_검색한다(query);

    this.logger.log(`파일 검색 완료 - 총 ${result.length}개`);

    return result;
  }

  /**
   * 파일을 조회한다
   */
  async 파일을_조회한다(
    id: string,
    includeTargetEmployees: boolean = false,
  ): Promise<any> {
    this.logger.log(`파일 조회 시작 - ID: ${id}`);

    const wiki = await this.wikiContextService.위키_상세를_조회한다(id);

    this.logger.log(`파일 조회 완료 - ID: ${id}`);

    const result: any = { ...wiki };

    // 대상 직원 정보 포함 옵션이 true면 추가
    if (includeTargetEmployees) {
      const targetEmployeesList =
        await this.위키_대상_직원_상세_정보를_조회한다(wiki);
      result.recipients = {
        total: targetEmployeesList.length,
        employees: targetEmployeesList,
      };
    }

    return result;
  }

  /**
   * 파일을 생성한다 (업로드 포함)
   */
  async 파일을_생성한다(
    name: string,
    parentId: string | null,
    title: string | null,
    content: string | null,
    createdBy?: string,
    files?: Express.Multer.File[],
    isPublic?: boolean,
    permissionRankIds?: string[],
    permissionPositionIds?: string[],
    permissionDepartmentIds?: string[],
  ): Promise<WikiFileSystem> {
    this.logger.log(`파일 생성 시작 - 이름: ${name}`);

    // 파일 업로드 처리
    let attachments:
      | Array<{
          fileName: string;
          fileUrl: string;
          fileSize: number;
          mimeType: string;
          deletedAt?: Date | null;
        }>
      | undefined = undefined;

    if (files && files.length > 0) {
      this.logger.log(`${files.length}개의 파일 업로드 시작`);
      
      // 폴더 경로 구성
      let folderPath = 'wiki';
      if (parentId) {
        try {
          const breadcrumb = await this.wikiContextService.위키_경로를_직접_조회한다(parentId);
          if (breadcrumb && breadcrumb.length > 0) {
            // 루트부터 현재 폴더까지의 경로를 '/'로 연결
            const pathSegments = breadcrumb.map(item => item.name);
            folderPath = `wiki/${pathSegments.join('/')}`;
            this.logger.log(`S3 업로드 경로: ${folderPath}`);
          }
        } catch (error) {
          this.logger.warn(`폴더 경로 조회 실패, 기본 경로 사용 - parentId: ${parentId}`, error);
        }
      }
      
      const uploadedFiles = await this.storageService.uploadFiles(
        files,
        folderPath,
      );
      attachments = uploadedFiles.map((file) => ({
        fileName: file.fileName,
        fileUrl: file.url,
        fileSize: file.fileSize,
        mimeType: file.mimeType,
      }));
      this.logger.log(`파일 업로드 완료: ${attachments.length}개`);
    }

    const result = await this.wikiContextService.파일을_생성한다({
      name,
      parentId: parentId || null,
      title,
      content,
      attachments,
      isPublic,
      permissionRankIds,
      permissionPositionIds,
      permissionDepartmentIds,
      createdBy,
    });

    const file = await this.wikiContextService.위키_상세를_조회한다(result.id);

    this.logger.log(`파일 생성 완료 - ID: ${file.id}`);

    return file;
  }

  /**
   * 빈 파일을 생성한다
   */
  async 빈_파일을_생성한다(
    name: string,
    parentId: string | null,
    createdBy?: string,
    isPublic?: boolean,
  ): Promise<WikiFileSystem> {
    this.logger.log(`빈 파일 생성 시작 - 이름: ${name}`);

    const result = await this.wikiContextService.파일을_생성한다({
      name,
      parentId: parentId || null,
      isPublic,
      createdBy,
    });

    const file = await this.wikiContextService.위키_상세를_조회한다(result.id);

    this.logger.log(`빈 파일 생성 완료 - ID: ${file.id}`);

    return file;
  }

  /**
   * 파일을 수정한다 (업로드 포함)
   */
  async 파일을_수정한다(
    id: string,
    name: string,
    title: string | null,
    content: string | null,
    updatedBy?: string,
    files?: Express.Multer.File[],
    isPublic?: boolean,
    permissionRankIds?: string[],
    permissionPositionIds?: string[],
    permissionDepartmentIds?: string[],
  ): Promise<WikiFileSystem> {
    this.logger.log(`파일 수정 시작 - ID: ${id}`);

    // 1. 기존 파일 조회
    const existingFile = await this.wikiContextService.위키_상세를_조회한다(id);

    // 2. 기존 첨부파일 유지 (삭제되지 않은 파일만)
    const currentAttachments = existingFile.attachments || [];
    const activeAttachments = currentAttachments.filter((att: any) => !att.deletedAt);
    this.logger.log(`기존 활성 첨부파일 수: ${activeAttachments.length}개`);

    // 3. 새 파일 업로드 처리
    let newAttachments: Array<{
      fileName: string;
      fileUrl: string;
      fileSize: number;
      mimeType: string;
      deletedAt?: Date | null;
    }> = [];

    if (files && files.length > 0) {
      this.logger.log(`${files.length}개의 파일 업로드 시작`);
      
      // 폴더 경로 구성
      let folderPath = 'wiki';
      const parentId = existingFile.parentId;
      if (parentId) {
        try {
          const breadcrumb = await this.wikiContextService.위키_경로를_직접_조회한다(parentId);
          if (breadcrumb && breadcrumb.length > 0) {
            // 루트부터 현재 폴더까지의 경로를 '/'로 연결
            const pathSegments = breadcrumb.map(item => item.name);
            folderPath = `wiki/${pathSegments.join('/')}`;
            this.logger.log(`S3 업로드 경로: ${folderPath}`);
          }
        } catch (error) {
          this.logger.warn(`폴더 경로 조회 실패, 기본 경로 사용 - parentId: ${parentId}`, error);
        }
      }
      
      const uploadedFiles = await this.storageService.uploadFiles(
        files,
        folderPath,
      );
      newAttachments = uploadedFiles.map((file) => ({
        fileName: file.fileName,
        fileUrl: file.url,
        fileSize: file.fileSize,
        mimeType: file.mimeType,
      }));
      this.logger.log(`파일 업로드 완료: ${newAttachments.length}개`);
    }

    // 4. 기존 첨부파일 + 새 첨부파일 합치기
    const finalAttachments = [...activeAttachments, ...newAttachments];
    this.logger.log(`최종 첨부파일 수: ${finalAttachments.length}개`);

    // 5. 파일 정보 업데이트
    await this.wikiContextService.위키_파일을_수정한다(id, {
      attachments: finalAttachments,
      updatedBy,
    });

    // 6. 내용 수정
    const result = await this.wikiContextService.위키를_수정한다(id, {
      name,
      title,
      content,
      isPublic,
      permissionRankIds,
      permissionPositionIds,
      permissionDepartmentIds,
      updatedBy,
    });

    this.logger.log(`파일 수정 완료 - ID: ${id}`);

    return result;
  }

  /**
   * 위키 첨부파일을 삭제한다
   */
  async 위키_첨부파일을_삭제한다(
    id: string,
    fileUrl: string,
  ): Promise<WikiFileSystem> {
    this.logger.log(
      `위키 첨부파일 삭제 시작 - ID: ${id}, 파일: ${fileUrl}`,
    );

    const result =
      await this.wikiContextService.위키_첨부파일을_삭제한다(
        id,
        fileUrl,
      );

    this.logger.log(`위키 첨부파일 삭제 완료 - ID: ${id}`);

    return result;
  }

  /**
   * 위키의 무효한 권한 ID를 새로운 ID로 교체한다
   * 
   * 트랜잭션과 비관적 잠금을 사용하여 동시성 문제 방지:
   * - SELECT ... FOR UPDATE로 row-level 잠금 획득
   * - 권한 교체와 로그 생성이 원자적으로 수행
   */
  async 위키_권한을_교체한다(
    wikiId: string,
    dto: ReplaceWikiPermissionsDto,
    userId: string,
  ): Promise<{
    success: boolean;
    message: string;
    replacedDepartments: number;
  }> {
    this.logger.log(`위키 권한 교체 시작 (트랜잭션) - ID: ${wikiId}`);

    // 트랜잭션 내에서 모든 작업 수행
    return await this.dataSource.transaction(async (manager) => {
      // 1. SELECT ... FOR UPDATE로 배타적 잠금 획득
      const wiki = await manager
        .getRepository(WikiFileSystem)
        .createQueryBuilder('wiki')
        .where('wiki.id = :id', { id: wikiId })
        .andWhere('wiki.deletedAt IS NULL')
        .setLock('pessimistic_write') // Row-level exclusive lock
        .getOne();

      if (!wiki) {
        throw new NotFoundException('위키를 찾을 수 없습니다');
      }

      this.logger.log(`위키 잠금 획득 완료 - ID: ${wikiId}`);

      let replacedDepartments = 0;
      const changes: string[] = [];

      // 2. 부서 ID 교체
      if (dto.departments && dto.departments.length > 0) {
        const currentDepartmentIds = wiki.permissionDepartmentIds || [];
        const newDepartmentIds = [...currentDepartmentIds];

        for (const mapping of dto.departments) {
          const index = newDepartmentIds.indexOf(mapping.oldId);
          if (index !== -1) {
            newDepartmentIds[index] = mapping.newId;
            replacedDepartments++;
            changes.push(`부서 ${mapping.oldId} → ${mapping.newId}`);
            this.logger.log(`부서 교체: ${mapping.oldId} → ${mapping.newId}`);
          }
        }

        wiki.permissionDepartmentIds = newDepartmentIds;
      }

      // 3. 위키 업데이트 (트랜잭션 내에서)
      wiki.updatedAt = new Date();
      await manager.save(WikiFileSystem, wiki);

      // 4. RESOLVED 로그 생성 (트랜잭션 내에서)
      let resolvedByValue: string | null = userId;
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (userId && !uuidRegex.test(userId)) {
        this.logger.warn(`사용자 ID가 UUID 형식이 아닙니다: ${userId}. resolvedBy를 null로 설정합니다.`);
        resolvedByValue = null;
      }

      try {
        await manager.save(WikiPermissionLog, {
          wikiFileSystemId: wiki.id,
          invalidDepartments: null,
          invalidRankCodes: null,
          invalidPositionCodes: null,
          snapshotPermissions: {
            permissionRankIds: wiki.permissionRankIds,
            permissionPositionIds: wiki.permissionPositionIds,
            permissionDepartments: [],
          },
          action: WikiPermissionAction.RESOLVED,
          note: dto.note || `관리자가 권한 교체 완료: ${changes.join(', ')}`,
          detectedAt: new Date(),
          resolvedAt: new Date(),
          resolvedBy: resolvedByValue,
        });
      } catch (error) {
        if (error instanceof QueryFailedError) {
          const pgError = error as any;
          if (pgError.code === '22P02') {
            throw new BadRequestException('유효하지 않은 사용자 ID 형식입니다. UUID 형식이어야 합니다.');
          }
        }
        throw error;
      }

      this.logger.log(`위키 권한 교체 완료 (트랜잭션 커밋) - 부서: ${replacedDepartments}개`);

      return {
        success: true,
        message: '권한 ID가 성공적으로 교체되었습니다',
        replacedDepartments,
      };
    });
  }

  /**
   * 사용자 이름 조회 (createdBy, updatedBy용)
   * 
   * @private
   * @param userIds - 조회할 사용자 ID 배열 (UUID 또는 employeeNumber)
   * @returns 사용자 ID를 키로, 이름을 값으로 하는 Map
   */
  private async 사용자_이름_맵을_조회한다(userIds: (string | null)[]): Promise<Map<string, string>> {
    const nameMap = new Map<string, string>();
    
    // null 제거 및 중복 제거
    const validUserIds = [...new Set(userIds.filter((id): id is string => id !== null && id !== undefined))];
    
    if (validUserIds.length === 0) {
      return nameMap;
    }

    try {
      const employees = await this.companyContextService.직원_목록을_조회한다(validUserIds);
      
      employees.forEach(employee => {
        if (employee.name) {
          // employee.id (UUID)와 employee.employeeNumber 둘 다 Map에 추가
          if (employee.id) {
            nameMap.set(employee.id, employee.name);
          }
          if (employee.employeeNumber) {
            nameMap.set(employee.employeeNumber, employee.name);
          }
        }
      });
      
      this.logger.debug(`사용자 이름 조회 완료 - 요청: ${validUserIds.length}명, 조회: ${employees.length}명`);
    } catch (error) {
      this.logger.warn(`사용자 이름 조회 실패 (무시하고 계속)`, error);
      // 사용자 이름 조회 실패는 치명적이지 않으므로 빈 Map 반환
    }

    return nameMap;
  }

  /**
   * Wiki 대상 직원 상세 정보를 조회한다
   * @private
   */
  async 위키_대상_직원_상세_정보를_조회한다(
    wiki: WikiFileSystem,
  ): Promise<any[]> {
    this.logger.log(
      `Wiki 대상 직원 상세 정보 조회 시작 - ID: ${wiki.id}`,
    );

    // 1. 조직 정보에서 직원 정보 추출 (비활성 부서 포함)
    const orgInfo = await this.companyContextService.조직_정보를_가져온다(true);
    
    // 2. 직원 맵 생성 (UUID와 employeeNumber 둘 다 키로 사용)
    const employeeMapByUuid = new Map<string, any>();
    const employeeMapByNumber = new Map<string, any>();
    
    const extractFromDept = (dept: any) => {
      if (dept.employees) {
        dept.employees.forEach((emp: any) => {
          const employeeInfo = {
            employeeNumber: emp.employeeNumber,
            name: emp.name || '알 수 없음',
            departmentId: dept.id || null,
            departmentName: dept.departmentName || dept.name || '알 수 없음',
            rankId: emp.rankId || null,
            rankName: emp.rankName || null,
            positionId: emp.positionId || null,
            positionName: emp.positionName || null,
          };
          
          // UUID로 매핑
          if (emp.id) {
            employeeMapByUuid.set(emp.id, employeeInfo);
          }
          // employeeNumber로 매핑
          if (emp.employeeNumber) {
            employeeMapByNumber.set(emp.employeeNumber, employeeInfo);
          }
        });
      }
      
      const children = dept.childDepartments || dept.children;
      if (children) {
        children.forEach((child: any) => extractFromDept(child));
      }
    };
    
    if (orgInfo.departments) {
      orgInfo.departments.forEach((dept) => extractFromDept(dept));
    }

    this.logger.debug(
      `조직 정보에서 직원 맵 생성 완료 - UUID 기준: ${employeeMapByUuid.size}명, 사번 기준: ${employeeMapByNumber.size}명`,
    );

    // 3. 대상 직원 employeeNumber 목록 추출
    const targetEmployeeNumbers = new Set<string>();

    // 3-1. 부서/직급/직책으로 필터링된 직원들 (employeeNumber)
    if (
      wiki.permissionDepartmentIds &&
      wiki.permissionDepartmentIds.length > 0
    ) {
      const employees = this.조직에서_부서별_직원ID를_추출한다(
        orgInfo,
        wiki.permissionDepartmentIds,
      );
      employees.forEach((id) => targetEmployeeNumbers.add(id));
    }

    if (
      wiki.permissionRankIds &&
      wiki.permissionRankIds.length > 0
    ) {
      const employees = this.조직에서_직급별_직원ID를_추출한다(
        orgInfo,
        wiki.permissionRankIds,
      );
      employees.forEach((id) => targetEmployeeNumbers.add(id));
    }

    if (
      wiki.permissionPositionIds &&
      wiki.permissionPositionIds.length > 0
    ) {
      const employees = this.조직에서_직책별_직원ID를_추출한다(
        orgInfo,
        wiki.permissionPositionIds,
      );
      employees.forEach((id) => targetEmployeeNumbers.add(id));
    }

    // 3-2. 전사공개이면서 권한 필터가 없는 경우 모든 직원
    const hasPermissionFilters =
      (wiki.permissionRankIds &&
        wiki.permissionRankIds.length > 0) ||
      (wiki.permissionPositionIds &&
        wiki.permissionPositionIds.length > 0) ||
      (wiki.permissionDepartmentIds &&
        wiki.permissionDepartmentIds.length > 0);

    if (wiki.isPublic && !hasPermissionFilters) {
      const allEmployees = this.조직에서_모든_직원ID를_추출한다(orgInfo);
      allEmployees.forEach((id) => targetEmployeeNumbers.add(id));
    }

    if (targetEmployeeNumbers.size === 0) {
      this.logger.log('대상 직원이 없습니다.');
      return [];
    }

    // 4. 각 직원의 상세 정보 조합
    const targetEmployees = Array.from(targetEmployeeNumbers).map((employeeNumber) => {
      const employeeInfo = employeeMapByNumber.get(employeeNumber);

      return {
        employeeNumber, // SSO 사번 (employeeNumber)
        employeeName: employeeInfo?.name || '알 수 없음',
        departmentId: employeeInfo?.departmentId || null,
        departmentName: employeeInfo?.departmentName || '알 수 없음',
        rankId: employeeInfo?.rankId || null,
        rankName: employeeInfo?.rankName || null,
        positionId: employeeInfo?.positionId || null,
        positionName: employeeInfo?.positionName || null,
      };
    });

    this.logger.log(
      `Wiki 대상 직원 상세 정보 조회 완료 - 총 ${targetEmployees.length}명`,
    );

    return targetEmployees;
  }

  /**
   * 조직에서 모든 직원 ID를 추출한다
   * @private
   */
  private 조직에서_모든_직원ID를_추출한다(orgInfo: any): string[] {
    const employeeIds: string[] = [];

    const extractFromDept = (dept: any) => {
      if (dept.employees) {
        dept.employees.forEach((emp: any) => {
          if (emp.employeeNumber) {
            employeeIds.push(emp.employeeNumber);
          }
        });
      }
      const children = dept.childDepartments || dept.children;
      if (children) {
        children.forEach((child: any) => extractFromDept(child));
      }
    };

    if (orgInfo.departments) {
      orgInfo.departments.forEach((dept) => extractFromDept(dept));
    }

    return employeeIds;
  }

  /**
   * 조직에서 직급별 직원 ID를 추출한다
   * @private
   */
  private 조직에서_직급별_직원ID를_추출한다(
    orgInfo: any,
    rankIds: string[],
  ): string[] {
    const employeeIds: string[] = [];
    const rankIdSet = new Set(rankIds);

    const extractFromDept = (dept: any) => {
      if (dept.employees) {
        dept.employees.forEach((emp: any) => {
          if (emp.employeeNumber && emp.rankId && rankIdSet.has(emp.rankId)) {
            employeeIds.push(emp.employeeNumber);
          }
        });
      }
      const children = dept.childDepartments || dept.children;
      if (children) {
        children.forEach((child: any) => extractFromDept(child));
      }
    };

    if (orgInfo.departments) {
      orgInfo.departments.forEach((dept) => extractFromDept(dept));
    }

    return employeeIds;
  }

  /**
   * 조직에서 직책별 직원 ID를 추출한다
   * @private
   */
  private 조직에서_직책별_직원ID를_추출한다(
    orgInfo: any,
    positionIds: string[],
  ): string[] {
    const employeeIds: string[] = [];
    const positionIdSet = new Set(positionIds);

    const extractFromDept = (dept: any) => {
      if (dept.employees) {
        dept.employees.forEach((emp: any) => {
          if (
            emp.employeeNumber &&
            emp.positionId &&
            positionIdSet.has(emp.positionId)
          ) {
            employeeIds.push(emp.employeeNumber);
          }
        });
      }
      const children = dept.childDepartments || dept.children;
      if (children) {
        children.forEach((child: any) => extractFromDept(child));
      }
    };

    if (orgInfo.departments) {
      orgInfo.departments.forEach((dept) => extractFromDept(dept));
    }

    return employeeIds;
  }

  /**
   * 조직에서 부서별 직원 ID를 추출한다
   * @private
   */
  private 조직에서_부서별_직원ID를_추출한다(
    orgInfo: any,
    departmentIds: string[],
  ): string[] {
    const employeeIds: string[] = [];
    const departmentIdSet = new Set(departmentIds);

    this.logger.debug(
      `부서별 직원 추출 시작 - 대상 부서 ID: ${departmentIds.join(', ')}`,
    );

    const extractFromDept = (dept: any, depth: number = 0) => {
      const isDepartmentMatch = dept.id && departmentIdSet.has(dept.id);

      if (isDepartmentMatch) {
        const employeeCount = dept.employees?.length || 0;
        this.logger.debug(
          `${'  '.repeat(depth)}부서 매칭: ${dept.departmentName || dept.name} (${dept.id}) - 직원 ${employeeCount}명`,
        );

        if (dept.employees) {
          dept.employees.forEach((emp: any) => {
            if (emp.employeeNumber) {
              employeeIds.push(emp.employeeNumber);
            }
          });
        }
      }

      const children = dept.childDepartments || dept.children;
      if (children) {
        children.forEach((child: any) => extractFromDept(child, depth + 1));
      }
    };

    if (orgInfo.departments) {
      orgInfo.departments.forEach((dept) => extractFromDept(dept));
    }

    this.logger.debug(
      `부서별 직원 추출 완료 - 총 ${employeeIds.length}명`,
    );

    return employeeIds;
  }
}
