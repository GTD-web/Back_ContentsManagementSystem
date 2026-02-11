import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '@interface/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@interface/common/decorators/current-user.decorator';
import { WikiBusinessService } from '@business/wiki-business/wiki-business.service';
import { WikiPermissionScheduler } from '@context/wiki-context/wiki-permission.scheduler';
import { WikiFileSystem } from '@domain/sub/wiki-file-system/wiki-file-system.entity';
import {
  CreateFolderDto,
  CreateFileDto,
  CreateEmptyFileDto,
  UpdateFolderDto,
  UpdateFolderNameDto,
  UpdateFilePublicDto,
  UpdateWikiPathDto,
  WikiResponseDto,
  WikiListResponseDto,
  WikiSearchListResponseDto,
  WikiSearchResultDto,
} from '@interface/common/dto/wiki/wiki.dto';
import { ReplaceWikiPermissionsDto } from './dto/replace-wiki-permissions.dto';
import { DismissPermissionLogsDto } from './dto/dismiss-permission-logs.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { WikiPermissionLog } from '@domain/sub/wiki-file-system/wiki-permission-log.entity';
import { WikiPermissionAction } from '@domain/sub/wiki-file-system/wiki-permission-action.types';
import { DismissedPermissionLog } from '@domain/common/dismissed-permission-log/dismissed-permission-log.entity';
import { DismissedPermissionLogType } from '@domain/common/dismissed-permission-log/dismissed-permission-log.types';
import { CompanyContextService } from '@context/company-context/company-context.service';
import { Logger } from '@nestjs/common';

@ApiTags('A-10. 관리자 - Wiki')
@ApiBearerAuth('Bearer')
@Controller('admin/wiki')
export class WikiController {
  private readonly logger = new Logger(WikiController.name);

  constructor(
    private readonly wikiBusinessService: WikiBusinessService,
    private readonly wikiPermissionScheduler: WikiPermissionScheduler,
    private readonly companyContextService: CompanyContextService,
    @InjectRepository(WikiPermissionLog)
    private readonly permissionLogRepository: Repository<WikiPermissionLog>,
    @InjectRepository(DismissedPermissionLog)
    private readonly dismissedLogRepository: Repository<DismissedPermissionLog>,
  ) {}

  /**
   * 폴더 구조를 가져온다 (트리 구조)
   */
  @Get('folders/structure')
  @ApiOperation({
    summary: '폴더 구조 조회',
    description:
      '전체 폴더 구조를 트리 형태로 조회합니다. 각 폴더는 하위 폴더와 파일을 포함하며, 경로 정보(path, pathIds)도 함께 제공됩니다.',
  })
  @ApiResponse({
    status: 200,
    description: '폴더 구조 조회 성공 (트리 구조)',
    type: WikiListResponseDto,
  })
  @ApiQuery({
    name: 'ancestorId',
    required: false,
    type: String,
    description: '조상 폴더 ID (없으면 최상위부터)',
    example: 'uuid-of-ancestor-folder',
  })
  @ApiQuery({
    name: 'excludeRoot',
    required: false,
    type: Boolean,
    description: '(더 이상 사용되지 않음 - 하위 호환성을 위해 유지)',
    example: false,
  })
  async 폴더_구조를_가져온다(
    @Query('ancestorId') ancestorId?: string,
    @Query('excludeRoot') excludeRootParam?: string,
  ): Promise<WikiListResponseDto> {
    const excludeRoot = excludeRootParam === 'true';

    const items =
      await this.wikiBusinessService.폴더_구조를_가져온다(ancestorId, excludeRoot);

    // permissionDepartmentIds가 비어있는 항목이 있는지 확인하고 비동기로 권한 검증 배치 실행
    const hasEmptyPermissionDepartmentIds = items.some(
      (item) =>
        !item.permissionDepartmentIds ||
        item.permissionDepartmentIds.length === 0,
    );

    if (hasEmptyPermissionDepartmentIds) {
      // 비동기로 권한 검증 배치 실행 (응답을 기다리지 않음)
      this.wikiPermissionScheduler
        .모든_위키_권한을_검증한다()
        .catch((error) => {
          // 에러 로깅만 하고 응답에는 영향 없음
          console.error('권한 검증 배치 실행 중 오류:', error);
        });
    }

    // 트리 구조로 변환
    const tree = await this.buildTree(items);

    return {
      items: tree,
      total: items.length,
    };
  }

  /**
   * 평탄한 목록을 트리 구조로 변환하는 헬퍼 메서드
   */
  private async buildTree(items: WikiFileSystem[]): Promise<WikiResponseDto[]> {
    // 모든 아이템에서 createdBy, updatedBy 수집
    const allUserIds = items.flatMap(item => [item.createdBy, item.updatedBy]);
    const userNameMap = await this.사용자_이름_맵을_조회한다(allUserIds);

    // parentId별로 그룹화
    const itemsByParent = new Map<string | null, WikiFileSystem[]>();
    for (const item of items) {
      const parentId = item.parentId || null;
      if (!itemsByParent.has(parentId)) {
        itemsByParent.set(parentId, []);
      }
      itemsByParent.get(parentId)!.push(item);
    }

    // 재귀적으로 트리 구조 생성
    const buildChildren = (parentId: string | null): WikiResponseDto[] => {
      const children = itemsByParent.get(parentId) || [];
      return children.map((child) => {
        // 경로 정보 추출 (비즈니스 서비스에서 추가한 임시 속성)
        const path = (child as any).path || [];
        const pathIds = (child as any).pathIds || [];
        
        // 사용자 이름 조회
        const createdByName = child.createdBy ? userNameMap.get(child.createdBy) || null : null;
        const updatedByName = child.updatedBy ? userNameMap.get(child.updatedBy) || null : null;
        
        const childDto = WikiResponseDto.from(child, undefined, path, pathIds, createdByName, updatedByName);
        // 폴더인 경우 하위 항목 재귀적으로 추가
        if (child.type === 'folder') {
          const subChildren = buildChildren(child.id);
          if (subChildren.length > 0) {
            childDto.children = subChildren;
          }
        }
        return childDto;
      });
    };

    // 루트 항목들부터 시작
    const rootParentId = items.length > 0 && items[0].parentId ? items[0].parentId : null;
    return buildChildren(rootParentId);
  }

  /**
   * 사용자 이름 조회 헬퍼 메서드
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
    } catch (error) {
      this.logger.warn(`사용자 이름 조회 실패 (무시하고 계속)`, error);
    }

    return nameMap;
  }

  /**
   * 경로로 폴더를 조회한다 (하위 항목 포함)
   */
  @Get('folders/by-path')
  @ApiOperation({
    summary: '경로로 폴더 조회',
    description:
      '폴더 경로로 폴더를 조회합니다. 폴더 상세 정보와 하위 폴더/파일 목록을 반환하며, 경로 정보(path, pathIds)도 함께 제공됩니다.\n\n' +
      '**경로 형식**:\n' +
      '- `/폴더1` → 최상위의 "폴더1" 폴더\n' +
      '- `/폴더1/폴더2` → "폴더1" 하위의 "폴더2" 폴더\n' +
      '- `폴더1/폴더2` (슬래시 없이도 가능)\n' +
      '- 각 폴더 이름은 `/`로 구분\n\n' +
      '⚠️ **주의**: `/` 경로는 사용할 수 없습니다. 최상위 폴더들을 조회하려면 폴더 구조 조회 API를 사용하세요.',
  })
  @ApiResponse({
    status: 200,
    description: '폴더 조회 성공 (하위 항목 및 경로 정보 포함)',
    type: WikiResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '루트 경로(/)는 사용할 수 없음',
  })
  @ApiQuery({
    name: 'path',
    description: '폴더 경로 (예: /폴더1/폴더2)',
    example: '/회의록/2024년',
    required: true,
  })
  async 경로로_폴더를_조회한다(@Query('path') path: string): Promise<WikiResponseDto> {
    const folder = await this.wikiBusinessService.경로로_폴더를_조회한다(path);
    const children = await this.wikiBusinessService.폴더_하위_항목을_조회한다(folder.id);
    
    // 경로 정보 조회 (이미 루트부터 정렬되어 있음)
    const breadcrumb = await this.wikiBusinessService.위키_경로를_조회한다(folder.id);
    const parents = breadcrumb.filter(item => item.id !== folder.id);
    
    const pathNames = parents.map(item => item.name);
    const pathIds = parents.map(item => item.id);
    
    // 사용자 이름 조회
    const allUserIds = [folder.createdBy, folder.updatedBy, ...children.flatMap(c => [c.createdBy, c.updatedBy])];
    const userNameMap = await this.사용자_이름_맵을_조회한다(allUserIds);
    
    const createdByName = folder.createdBy ? userNameMap.get(folder.createdBy) || null : null;
    const updatedByName = folder.updatedBy ? userNameMap.get(folder.updatedBy) || null : null;
    
    return WikiResponseDto.from(folder, children, pathNames, pathIds, createdByName, updatedByName);
  }

  /**
   * 폴더를 조회한다 (하위 항목 포함)
   */
  @Get('folders/:id')
  @ApiOperation({
    summary: '폴더 상세 조회',
    description: '폴더 상세 정보와 하위 폴더/파일 목록을 조회합니다. 권한 설정에 맞는 대상 직원 정보도 포함됩니다.',
  })
  @ApiResponse({
    status: 200,
    description: '폴더 조회 성공 (하위 항목 및 대상 직원 정보 포함)',
    type: WikiResponseDto,
  })
  @ApiParam({ name: 'id', description: '폴더 ID' })
  async 폴더를_조회한다(@Param('id') id: string): Promise<WikiResponseDto> {
    // includeTargetEmployees를 true로 설정하여 대상 직원 정보 포함
    const folder = await this.wikiBusinessService.폴더를_조회한다(id, true);
    const children = await this.wikiBusinessService.폴더_하위_항목을_조회한다(id);
    
    // 사용자 이름 조회
    const allUserIds = [folder.createdBy, folder.updatedBy, ...children.flatMap(c => [c.createdBy, c.updatedBy])];
    const userNameMap = await this.사용자_이름_맵을_조회한다(allUserIds);
    
    const createdByName = folder.createdBy ? userNameMap.get(folder.createdBy) || null : null;
    const updatedByName = folder.updatedBy ? userNameMap.get(folder.updatedBy) || null : null;
    
    const result = WikiResponseDto.from(folder, children, undefined, undefined, createdByName, updatedByName);
    
    // 권한 기반 대상 직원 정보 추가
    if (folder.recipients) {
      result.recipients = folder.recipients;
    }
    result.isPermissionInherited = folder.isPermissionInherited ?? false;
    if (folder.inheritedFrom) {
      result.inheritedFrom = folder.inheritedFrom;
    }
    
    return result;
  }

  /**
   * 폴더의 하위 항목들을 조회한다
   */
  @Get('folders/:id/children')
  @ApiOperation({
    summary: '폴더 하위 항목 조회',
    description: '폴더의 하위 폴더 및 파일 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '하위 항목 조회 성공',
    type: WikiListResponseDto,
  })
  @ApiParam({ name: 'id', description: '폴더 ID' })
  async 폴더_하위_항목들을_조회한다(
    @Param('id') id: string,
  ): Promise<WikiListResponseDto> {
    const items = await this.wikiBusinessService.폴더_하위_항목을_조회한다(id);
    return {
      items: items.map((item) => WikiResponseDto.from(item)),
      total: items.length,
    };
  }

  /**
   * 폴더 공개를 수정한다
   */
  @Patch('folders/:id/public')
  @ApiOperation({
    summary: '폴더 공개 수정',
    description: '폴더의 공개 여부를 수정합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '폴더 공개 수정 성공',
    type: WikiResponseDto,
  })
  @ApiParam({ name: 'id', description: '폴더 ID' })
  async 폴더_공개를_수정한다(
    @Param('id') id: string,
    @Body() dto: UpdateFilePublicDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<WikiResponseDto> {
    const folder = await this.wikiBusinessService.폴더_공개를_수정한다(id, {
      isPublic: dto.isPublic,
      updatedBy: user.id,
    });
    return WikiResponseDto.from(folder);
  }

  /**
   * 폴더를 생성한다
   */
  @Post('folders')
  @ApiOperation({
    summary: '폴더 생성',
    description:
      '새로운 폴더를 생성합니다.\n\n' +
      '⚠️ **권한 정책**: 폴더는 기본적으로 전사공개로 생성됩니다.\n' +
      '권한 설정(permissionRankIds, permissionPositionIds, permissionDepartmentIds)을 통해 접근을 제한할 수 있습니다.\n\n' +
      '⚠️ **parentId**: 없으면 최상위 폴더로 생성됩니다.',
  })
  @ApiResponse({
    status: 201,
    description: '폴더 생성 성공',
    type: WikiResponseDto,
  })
  async 폴더를_생성한다(
    @Body() dto: CreateFolderDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<WikiResponseDto> {
    try {
      const folder = await this.wikiBusinessService.폴더를_생성한다({
        name: dto.name,
        parentId: dto.parentId || null,
        isPublic: dto.isPublic ?? true,
        permissionRankIds: dto.permissionRankIds,
        permissionPositionIds: dto.permissionPositionIds,
        permissionDepartmentIds: dto.permissionDepartmentIds,
        order: dto.order,
        createdBy: user.id,
      });
      
      // 사용자 이름 조회
      const userNameMap = await this.사용자_이름_맵을_조회한다([folder.createdBy, folder.updatedBy]);
      const createdByName = folder.createdBy ? userNameMap.get(folder.createdBy) || null : null;
      const updatedByName = folder.updatedBy ? userNameMap.get(folder.updatedBy) || null : null;
      
      return WikiResponseDto.from(folder, undefined, undefined, undefined, createdByName, updatedByName);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const pgError = error as any;
        if (pgError.code === '23503') {
          throw new BadRequestException('존재하지 않는 부모 폴더입니다.');
        } else if (pgError.code === '22P02') {
          throw new BadRequestException('유효하지 않은 UUID 형식입니다.');
        }
      }
      throw error;
    }
  }

  /**
   * 폴더를 삭제한다 (하위 항목 포함)
   */
  @Delete('folders/:id')
  @ApiOperation({
    summary: '폴더 삭제',
    description: '폴더 및 하위 모든 항목을 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '폴더 삭제 성공',
    schema: { type: 'object', properties: { success: { type: 'boolean' } } },
  })
  @ApiParam({ name: 'id', description: '폴더 ID' })
  async 폴더를_삭제한다(
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    const success = await this.wikiBusinessService.폴더를_삭제한다(id);
    return { success };
  }

  /**
   * 폴더만 삭제한다 (하위 항목이 있으면 실패)
   */
  @Delete('folders/:id/only')
  @ApiOperation({
    summary: '폴더만 삭제',
    description: '폴더만 삭제합니다. 하위 항목이 있으면 실패합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '폴더만 삭제 성공',
    schema: { type: 'object', properties: { success: { type: 'boolean' } } },
  })
  @ApiResponse({
    status: 400,
    description: '하위 항목이 있는 경우',
  })
  @ApiParam({ name: 'id', description: '폴더 ID' })
  async 폴더만_삭제한다(
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    try {
      const success = await this.wikiBusinessService.폴더만_삭제한다(id);
      return { success };
    } catch (error) {
      // BadRequestException은 그대로 전달 (400 에러)
      if (error instanceof BadRequestException) {
        throw error;
      }
      // 기타 에러는 500으로 처리
      throw error;
    }
  }

  /**
   * 폴더를 수정한다
   */
  @Patch('folders/:id')
  @ApiOperation({
    summary: '폴더 수정',
    description: '폴더 정보 및 권한을 수정합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '폴더 수정 성공',
    type: WikiResponseDto,
  })
  @ApiParam({ name: 'id', description: '폴더 ID' })
  async 폴더를_수정한다(
    @Param('id') id: string,
    @Body() dto: UpdateFolderDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<WikiResponseDto> {
    const folder = await this.wikiBusinessService.폴더를_수정한다(id, {
      name: dto.name,
      isPublic: dto.isPublic,
      permissionRankIds: dto.permissionRankIds,
      permissionPositionIds: dto.permissionPositionIds,
      permissionDepartmentIds: dto.permissionDepartmentIds,
      order: dto.order,
      updatedBy: user.id,
    });
    return WikiResponseDto.from(folder);
  }

  /**
   * 폴더 경로를 수정한다
   */
  @Patch('folders/:id/path')
  @ApiOperation({
    summary: '폴더 경로 수정',
    description: '폴더의 부모를 변경하여 경로를 수정합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '폴더 경로 수정 성공',
    type: WikiResponseDto,
  })
  @ApiParam({ name: 'id', description: '폴더 ID' })
  async 폴더_경로를_수정한다(
    @Param('id') id: string,
    @Body() dto: UpdateWikiPathDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<WikiResponseDto> {
    const folder = await this.wikiBusinessService.폴더_경로를_수정한다(id, {
      parentId: dto.parentId,
      updatedBy: user.id,
    });
    return WikiResponseDto.from(folder);
  }

  /**
   * 폴더 이름을 수정한다
   */
  @Patch('folders/:id/name')
  @ApiOperation({
    summary: '폴더 이름 수정',
    description: '폴더 이름만 수정합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '폴더 이름 수정 성공',
    type: WikiResponseDto,
  })
  @ApiParam({ name: 'id', description: '폴더 ID' })
  async 폴더_이름을_수정한다(
    @Param('id') id: string,
    @Body() dto: UpdateFolderNameDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<WikiResponseDto> {
    const folder = await this.wikiBusinessService.폴더_이름을_수정한다(id, {
      name: dto.name,
      updatedBy: user.id,
    });
    return WikiResponseDto.from(folder);
  }

  /**
   * 파일을 삭제한다
   */
  @Delete('files/:id')
  @ApiOperation({
    summary: '파일 삭제',
    description: '파일을 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '파일 삭제 성공',
    schema: { type: 'object', properties: { success: { type: 'boolean' } } },
  })
  @ApiParam({ name: 'id', description: '파일 ID' })
  async 파일을_삭제한다(
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    const success = await this.wikiBusinessService.파일을_삭제한다(id);
    return { success };
  }

  /**
   * 위키 파일 첨부파일을 개별 삭제한다
   */
  @Delete('files/:id/attachments')
  @ApiOperation({
    summary: '위키 파일 첨부파일 개별 삭제',
    description:
      '위키 파일의 특정 첨부파일을 삭제합니다.\n\n' +
      '**쿼리 파라미터:**\n' +
      '- `fileUrl`: 삭제할 파일의 URL (필수)\n\n' +
      '⚠️ **주의사항:**\n' +
      '- 파일 URL은 정확히 일치해야 합니다\n' +
      '- 실제 S3 파일은 삭제되지 않고, DB에서만 소프트 삭제됩니다',
  })
  @ApiParam({
    name: 'id',
    description: '위키 파일 ID (UUID)',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'fileUrl',
    description: '삭제할 파일의 URL',
    type: String,
    required: true,
    example: 'https://lumir-admin.s3.ap-northeast-2.amazonaws.com/wiki/file.pdf',
  })
  @ApiResponse({
    status: 200,
    description: '첨부파일 삭제 성공',
    type: WikiResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '위키 파일 또는 첨부파일을 찾을 수 없음',
  })
  @ApiResponse({
    status: 400,
    description: '파일 타입만 첨부파일을 삭제할 수 있습니다',
  })
  async 위키_파일_첨부파일을_삭제한다(
    @Param('id') id: string,
    @Query('fileUrl') fileUrl: string,
  ): Promise<WikiResponseDto> {
    const wiki =
      await this.wikiBusinessService.위키_첨부파일을_삭제한다(
        id,
        fileUrl,
      );

    return WikiResponseDto.from(wiki);
  }

  /**
   * 파일 경로를 수정한다
   */
  @Patch('files/:id/path')
  @ApiOperation({
    summary: '파일 경로 수정',
    description:
      '파일의 부모 폴더를 변경합니다.\n\n' +
      '⚠️ **권한 정책**: 새로운 부모 폴더의 권한이 적용됩니다 (cascading).',
  })
  @ApiResponse({
    status: 200,
    description: '파일 경로 수정 성공',
    type: WikiResponseDto,
  })
  @ApiParam({ name: 'id', description: '파일 ID' })
  async 파일_경로를_수정한다(
    @Param('id') id: string,
    @Body() dto: UpdateWikiPathDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<WikiResponseDto> {
    const file = await this.wikiBusinessService.파일_경로를_수정한다(id, {
      parentId: dto.parentId,
      updatedBy: user.id,
    });
    return WikiResponseDto.from(file);
  }

  /**
   * 파일 공개를 수정한다
   */
  @Patch('files/:id/public')
  @ApiOperation({
    summary: '파일 공개 수정',
    description:
      '파일의 공개 여부를 수정합니다.\n\n' +
      '⚠️ **권한 정책**:\n' +
      '- `isPublic: true` → 상위 폴더 권한 cascading\n' +
      '- `isPublic: false` → 완전 비공개 (아무도 접근 불가)',
  })
  @ApiResponse({
    status: 200,
    description: '파일 공개 수정 성공',
    type: WikiResponseDto,
  })
  @ApiParam({ name: 'id', description: '파일 ID' })
  async 파일_공개를_수정한다(
    @Param('id') id: string,
    @Body() dto: UpdateFilePublicDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<WikiResponseDto> {
    const file = await this.wikiBusinessService.파일_공개를_수정한다(id, {
      isPublic: dto.isPublic,
      updatedBy: user.id,
    });
    return WikiResponseDto.from(file);
  }

  /**
   * 파일들을 검색한다
   */
  @Get('files/search')
  @ApiOperation({
    summary: '파일 검색',
    description:
      '검색 텍스트로 파일을 검색합니다. 파일명, 제목, 본문을 검색하며 경로 정보를 포함합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '파일 검색 성공',
    type: WikiSearchListResponseDto,
  })
  @ApiQuery({
    name: 'query',
    required: true,
    description: '검색 텍스트',
    example: '회의록',
  })
  async 파일들을_검색한다(
    @Query('query') query: string,
  ): Promise<WikiSearchListResponseDto> {
    if (!query || query.trim().length === 0) {
      return { items: [], total: 0 };
    }

    const results = await this.wikiBusinessService.파일들을_검색한다(
      query.trim(),
    );

    // permissionDepartmentIds가 비어있는 항목이 있는지 확인하고 비동기로 권한 검증 배치 실행
    const hasEmptyPermissionDepartmentIds = results.some(
      (result) =>
        !result.wiki.permissionDepartmentIds ||
        result.wiki.permissionDepartmentIds.length === 0,
    );

    if (hasEmptyPermissionDepartmentIds) {
      // 비동기로 권한 검증 배치 실행 (응답을 기다리지 않음)
      this.wikiPermissionScheduler
        .모든_위키_권한을_검증한다()
        .catch((error) => {
          // 에러 로깅만 하고 응답에는 영향 없음
          console.error('권한 검증 배치 실행 중 오류:', error);
        });
    }

    return {
      items: results.map((result) =>
        WikiSearchResultDto.from(result.wiki, result.path),
      ),
      total: results.length,
    };
  }

  /**
   * 파일들을 조회한다
   */
  @Get('files')
  @ApiOperation({
    summary: '파일 목록 조회',
    description: '특정 폴더의 파일 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '파일 목록 조회 성공',
    type: WikiListResponseDto,
  })
  @ApiQuery({
    name: 'parentId',
    required: false,
    description: '부모 폴더 ID (없으면 루트)',
  })
  async 파일들을_조회한다(
    @Query('parentId') parentId?: string,
  ): Promise<WikiListResponseDto> {
    const items = await this.wikiBusinessService.파일들을_조회한다(
      parentId || null,
    );

    // permissionDepartmentIds가 비어있는 항목이 있는지 확인하고 비동기로 권한 검증 배치 실행
    const hasEmptyPermissionDepartmentIds = items.some(
      (item) =>
        !item.permissionDepartmentIds ||
        item.permissionDepartmentIds.length === 0,
    );

    if (hasEmptyPermissionDepartmentIds) {
      // 비동기로 권한 검증 배치 실행 (응답을 기다리지 않음)
      this.wikiPermissionScheduler
        .모든_위키_권한을_검증한다()
        .catch((error) => {
          // 에러 로깅만 하고 응답에는 영향 없음
          console.error('권한 검증 배치 실행 중 오류:', error);
        });
    }

    return {
      items: items.map((item) => WikiResponseDto.from(item)),
      total: items.length,
    };
  }

  /**
   * 파일을 조회한다
   */
  @Get('files/:id')
  @ApiOperation({
    summary: '파일 상세 조회',
    description:
      '파일 상세 정보를 조회합니다. 권한 설정에 맞는 대상 직원 정보도 포함됩니다.\n\n' +
      '⚠️ **권한 정책**: 상위 폴더들의 권한을 cascading하여 접근 권한이 결정됩니다.',
  })
  @ApiResponse({
    status: 200,
    description: '파일 조회 성공 (대상 직원 정보 포함)',
    type: WikiResponseDto,
  })
  @ApiParam({ name: 'id', description: '파일 ID' })
  async 파일을_조회한다(@Param('id') id: string): Promise<WikiResponseDto> {
    // includeTargetEmployees를 true로 설정하여 대상 직원 정보 포함
    const file = await this.wikiBusinessService.파일을_조회한다(id, true);
    
    // 사용자 이름 조회
    const userNameMap = await this.사용자_이름_맵을_조회한다([file.createdBy, file.updatedBy]);
    const createdByName = file.createdBy ? userNameMap.get(file.createdBy) || null : null;
    const updatedByName = file.updatedBy ? userNameMap.get(file.updatedBy) || null : null;
    
    const result = WikiResponseDto.from(file, undefined, undefined, undefined, createdByName, updatedByName);
    
    // 권한 기반 대상 직원 정보 추가
    if (file.recipients) {
      result.recipients = file.recipients;
    }
    result.isPermissionInherited = file.isPermissionInherited ?? false;
    if (file.inheritedFrom) {
      result.inheritedFrom = file.inheritedFrom;
    }
    
    return result;
  }

  /**
   * 빈 파일을 생성한다
   */
  @Post('files/empty')
  @ApiOperation({
    summary: '빈 파일 생성',
    description:
      '빈 파일을 생성합니다.\n\n' +
      '⚠️ **권한 정책**:\n' +
      '- `isPublic: true` (기본값) → 상위 폴더 권한 cascading\n' +
      '- `isPublic: false` → 완전 비공개 (아무도 접근 불가)\n\n' +
      '⚠️ **parentId**: 없으면 자동으로 루트 폴더 하위에 생성됩니다.',
  })
  @ApiResponse({
    status: 201,
    description: '빈 파일 생성 성공',
    type: WikiResponseDto,
  })
  async 빈_파일을_생성한다(
    @Body() dto: CreateEmptyFileDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<WikiResponseDto> {
    // name이 문자열이 아닌 경우 검증
    if (typeof dto.name !== 'string') {
      throw new BadRequestException('name 필드는 문자열이어야 합니다.');
    }

    // isPublic이 boolean이 아닌 경우 검증
    if (dto.isPublic !== undefined && typeof dto.isPublic !== 'boolean') {
      throw new BadRequestException('isPublic 필드는 boolean 값이어야 합니다.');
    }

    try {
      const file = await this.wikiBusinessService.빈_파일을_생성한다(
        dto.name,
        dto.parentId || null,
        user.id,
        dto.isPublic,
        dto.permissionRankIds,
        dto.permissionPositionIds,
        dto.permissionDepartmentIds,
      );
      return WikiResponseDto.from(file);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const pgError = error as any;
        if (pgError.code === '23503') {
          throw new BadRequestException('존재하지 않는 부모 폴더입니다.');
        } else if (pgError.code === '22P02') {
          throw new BadRequestException('유효하지 않은 UUID 형식입니다.');
        }
      }
      throw error;
    }
  }

  /**
   * 파일을 생성한다
   */
  @Post('files')
  @UseInterceptors(
    FilesInterceptor('files', undefined, {
      fileFilter: (req, file, callback) => {
        // 허용된 MIME 타입: 모든 파일 허용
        callback(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '파일 생성',
    description:
      '새로운 파일을 생성합니다. 첨부파일 업로드 가능.\n\n' +
      '⚠️ **권한 정책**:\n' +
      '- `isPublic: true` (기본값) → 상위 폴더 권한 cascading\n' +
      '- `isPublic: false` → 완전 비공개 (아무도 접근 불가)\n\n' +
      '⚠️ **parentId**: 없으면 자동으로 루트 폴더 하위에 생성됩니다.',
  })
  @ApiBody({
    description:
      '⚠️ **중요**: name은 필수입니다.\n\n' +
      '**파일 관리 방식**:\n' +
      '- `files`를 전송하면: 첨부파일과 함께 생성\n' +
      '- `files`를 전송하지 않으면: 파일 없이 생성',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: '파일명',
          example: '2024년 회의록',
        },
        parentId: {
          type: 'string',
          description: '부모 폴더 ID (선택, 없으면 루트 폴더 하위)',
          example: 'uuid',
        },
        title: {
          type: 'string',
          description: '문서 제목 (선택)',
          example: '2024년 1월 전사 회의록',
        },
        content: {
          type: 'string',
          description: '문서 본문 (선택)',
          example: '## 회의 안건\n\n1. 신제품 출시',
        },
        isPublic: {
          type: 'boolean',
          description:
            '공개 여부 (선택, 기본값: true - 상위 폴더 권한 cascading, false - 완전 비공개)',
          example: true,
        },
        permissionRankIds: {
          type: 'array',
          items: { type: 'string' },
          description: '접근 가능한 직급 ID 목록 (선택)',
        },
        permissionPositionIds: {
          type: 'array',
          items: { type: 'string' },
          description: '접근 가능한 직책 ID 목록 (선택)',
        },
        permissionDepartmentIds: {
          type: 'array',
          items: { type: 'string' },
          description: '접근 가능한 부서 ID 목록 (선택)',
        },
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: '첨부파일 목록 (선택)',
        },
      },
      required: ['name'],
    },
  })
  @ApiResponse({
    status: 201,
    description: '파일 생성 성공',
    type: WikiResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 (name 없음)',
  })
  async 파일을_생성한다(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateFileDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<WikiResponseDto> {
    try {
      const file = await this.wikiBusinessService.파일을_생성한다(
        dto.name,
        dto.parentId || null,
        dto.title || null,
        dto.content || null,
        user.id,
        files,
        dto.isPublic,
        dto.permissionRankIds,
        dto.permissionPositionIds,
        dto.permissionDepartmentIds,
      );
      return WikiResponseDto.from(file);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const pgError = error as any;
        if (pgError.code === '23503') {
          throw new BadRequestException('존재하지 않는 부모 폴더입니다.');
        } else if (pgError.code === '22P02') {
          throw new BadRequestException('유효하지 않은 UUID 형식입니다.');
        }
      }
      throw error;
    }
  }

  /**
   * 파일을 수정한다
   */
  @Put('files/:id')
  @UseInterceptors(
    FilesInterceptor('files', undefined, {
      fileFilter: (req, file, callback) => {
        // 허용된 MIME 타입: 모든 파일 허용
        callback(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '파일 수정',
    description: '파일 정보를 수정합니다. 첨부파일 업로드 가능.',
  })
  @ApiBody({
    description:
      '⚠️ **중요**: name은 필수입니다.\n\n' +
      '**파일 관리 방식**:\n' +
      '- `files`를 전송하면: 기존 첨부파일 유지 + 새 파일들 추가\n' +
      '- `files`를 전송하지 않으면: 기존 첨부파일 유지 (변경 없음)\n' +
      '- 개별 파일 삭제는 별도 엔드포인트(`DELETE /files/:id/attachments`) 사용',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: '파일명',
          example: '2024년 회의록',
        },
        title: {
          type: 'string',
          description: '문서 제목 (선택)',
          example: '2024년 1월 전사 회의록',
        },
        content: {
          type: 'string',
          description: '문서 본문 (선택)',
          example: '## 회의 안건\n\n1. 신제품 출시',
        },
        isPublic: {
          type: 'boolean',
          description:
            '공개 여부 (선택, true: 상위 폴더 권한 cascading, false: 완전 비공개)',
          example: true,
        },
        permissionRankIds: {
          type: 'array',
          items: { type: 'string' },
          description: '접근 가능한 직급 ID 목록 (선택)',
        },
        permissionPositionIds: {
          type: 'array',
          items: { type: 'string' },
          description: '접근 가능한 직책 ID 목록 (선택)',
        },
        permissionDepartmentIds: {
          type: 'array',
          items: { type: 'string' },
          description: '접근 가능한 부서 ID 목록 (선택)',
        },
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description:
            '첨부파일 목록 (선택) - 기존 파일은 유지되고 새 파일들이 추가됩니다',
        },
      },
      required: ['name'],
    },
  })
  @ApiResponse({
    status: 200,
    description: '파일 수정 성공',
    type: WikiResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 (name 없음)',
  })
  @ApiResponse({
    status: 404,
    description: '파일을 찾을 수 없음',
  })
  @ApiParam({ name: 'id', description: '파일 ID' })
  async 파일을_수정한다(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: any,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<WikiResponseDto> {
    const { 
      name, 
      title, 
      content, 
      isPublic,
      permissionRankIds,
      permissionPositionIds,
      permissionDepartmentIds,
    } = body;

    if (!name) {
      throw new BadRequestException('name 필드는 필수입니다.');
    }

    const file = await this.wikiBusinessService.파일을_수정한다(
      id,
      name,
      title || null,
      content || null,
      user.id,
      files,
      isPublic,
      permissionRankIds,
      permissionPositionIds,
      permissionDepartmentIds,
    );
    return WikiResponseDto.from(file);
  }

  /**
   * 모든 위키의 권한 로그 목록을 조회한다
   */
  @Get('permission-logs')
  @ApiOperation({
    summary: '위키 권한 로그 전체 조회',
    description:
      '모든 위키에서 감지된 비활성 부서 목록을 조회합니다. 관리자가 어떤 권한을 교체해야 하는지 확인할 수 있습니다.',
  })
  @ApiQuery({
    name: 'resolved',
    required: false,
    description: '해결 여부 필터 (true: 해결됨, false: 미해결, 미지정: 전체)',
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: '권한 로그 목록 조회 성공',
  })
  async 위키_권한_로그를_조회한다(
    @Query('resolved') resolvedParam?: string,
  ) {
    const where: any = {};
    
    // 쿼리 파라미터를 boolean으로 변환
    const resolved = resolvedParam === 'true' ? true : resolvedParam === 'false' ? false : undefined;

    if (resolved === true) {
      where.resolvedAt = Not(IsNull());
    } else if (resolved === false) {
      where.resolvedAt = IsNull();
    }

    return await this.permissionLogRepository.find({
      where,
      order: { detectedAt: 'DESC' },
      relations: ['wikiFileSystem'],
    });
  }

  /**
   * Dismissed되지 않은 미해결 권한 로그를 조회한다 (모달용)
   */
  @Get('permission-logs/unread')
  @ApiOperation({
    summary: '위키 권한 로그 미열람 조회 (모달용)',
    description:
      '관리자가 "다시 보지 않기"를 설정하지 않은 미해결 권한 로그를 조회합니다. ' +
      '모달 표시 여부를 결정하는 데 사용됩니다.',
  })
  @ApiResponse({
    status: 200,
    description: '미열람 권한 로그 목록 조회 성공',
  })
  async 위키_미열람_권한_로그를_조회한다(
    @CurrentUser() user: AuthenticatedUser,
  ) {
    // 미해결 로그 조회 (detected 상태)
    const unresolvedLogs = await this.permissionLogRepository.find({
      where: {
        action: WikiPermissionAction.DETECTED,
        resolvedAt: IsNull(),
      },
      order: { detectedAt: 'DESC' },
      relations: ['wikiFileSystem'],
    });

    // dismissed된 로그 ID 조회
    const dismissedLogs = await this.dismissedLogRepository.find({
      where: {
        logType: DismissedPermissionLogType.WIKI,
        dismissedBy: user.id,
      },
    });

    const dismissedLogIds = new Set(
      dismissedLogs.map((log) => log.permissionLogId),
    );

    // dismissed되지 않은 로그만 필터링
    return unresolvedLogs.filter((log) => !dismissedLogIds.has(log.id));
  }

  /**
   * 권한 로그를 "다시 보지 않기" 처리한다 (배치)
   */
  @Patch('permission-logs/dismiss')
  @ApiOperation({
    summary: '위키 권한 로그 일괄 무시 (다시 보지 않기)',
    description:
      '여러 권한 로그에 대한 모달을 더 이상 표시하지 않도록 설정합니다. ' +
      '권한 로그 관리 페이지에서는 여전히 조회 가능합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '권한 로그 무시 처리 성공',
    schema: {
      example: {
        success: true,
        message: '3개의 권한 로그를 무시 처리했습니다.',
        dismissed: 3,
        alreadyDismissed: 1,
        notFound: 0,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 (빈 배열 또는 잘못된 UUID)',
  })
  async 위키_권한_로그를_무시한다(
    @Body() dto: DismissPermissionLogsDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    let dismissedCount = 0;
    let alreadyDismissedCount = 0;
    let notFoundCount = 0;

    for (const logId of dto.logIds) {
      // 권한 로그 존재 확인
      const permissionLog = await this.permissionLogRepository.findOne({
        where: { id: logId },
      });

      if (!permissionLog) {
        notFoundCount++;
        continue;
      }

      // 이미 dismissed 되었는지 확인
      const existing = await this.dismissedLogRepository.findOne({
        where: {
          logType: DismissedPermissionLogType.WIKI,
          permissionLogId: logId,
          dismissedBy: user.id,
        },
      });

      if (existing) {
        alreadyDismissedCount++;
        continue;
      }

      // Dismissed 로그 생성
      await this.dismissedLogRepository.save({
        logType: DismissedPermissionLogType.WIKI,
        permissionLogId: logId,
        dismissedBy: user.id,
      });

      dismissedCount++;
    }

    return {
      success: true,
      message: `${dismissedCount}개의 권한 로그를 무시 처리했습니다.`,
      dismissed: dismissedCount,
      alreadyDismissed: alreadyDismissedCount,
      notFound: notFoundCount,
    };
  }

  /**
   * 위키의 무효한 권한 ID를 새로운 ID로 교체하고 관련 로그를 자동으로 해결 처리한다
   */
  @Patch(':id/replace-permissions')
  @ApiOperation({
    summary: '위키 권한 ID 교체 및 로그 해결',
    description:
      '비활성화된 부서 ID를 새로운 ID로 교체합니다. 예: 구 마케팅팀(DEPT_001) → 신 마케팅팀(DEPT_002)\n\n' +
      '권한 교체가 완료되면 자동으로 RESOLVED 로그가 생성됩니다.',
  })
  @ApiParam({
    name: 'id',
    description: '위키 ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: '권한 ID 교체 성공 및 로그 해결 완료',
  })
  @ApiResponse({
    status: 404,
    description: '위키를 찾을 수 없음',
  })
  async 위키_권한을_교체한다(
    @Param('id') id: string,
    @Body() dto: ReplaceWikiPermissionsDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.wikiBusinessService.위키_권한을_교체한다(
      id,
      dto,
      user.id,
    );
  }
}
