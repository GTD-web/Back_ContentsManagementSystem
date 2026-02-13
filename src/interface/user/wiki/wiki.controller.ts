import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiExtraModels,
  ApiBody,
} from '@nestjs/swagger';
import { CurrentUser } from '@interface/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@interface/common/decorators/current-user.decorator';
import { Public } from '@interface/common/decorators/public.decorator';
import { WikiBusinessService } from '@business/wiki-business/wiki-business.service';
import { CompanyContextService } from '@context/company-context/company-context.service';
import { Logger } from '@nestjs/common';
import { WikiFileSystem } from '@domain/sub/wiki-file-system/wiki-file-system.entity';
import {
  CreateFolderDto,
  CreateFileDto,
  CreateEmptyFileDto,
  UpdateFolderDto,
  UpdateFolderNameDto,
  UpdateWikiPathDto,
  WikiResponseDto,
  WikiListResponseDto,
  WikiSearchListResponseDto,
  WikiSearchResultDto,
  CheckWikiAccessDto,
  CheckWikiAccessResponseDto,
  WikiAccessWarningDto,
  AncestorPathItemDto,
} from '@interface/common/dto/wiki/wiki.dto';
import { WikiFileSystemType } from '@domain/sub/wiki-file-system/wiki-file-system-type.types';

@ApiTags('U-2. 사용자 - Wiki')
@ApiBearerAuth('Bearer')
@ApiExtraModels(CheckWikiAccessDto, CheckWikiAccessResponseDto, WikiAccessWarningDto, AncestorPathItemDto)
@Public()
@Controller('user/wiki')
export class UserWikiController {
  private readonly logger = new Logger(UserWikiController.name);

  constructor(
    private readonly wikiBusinessService: WikiBusinessService,
    private readonly companyContextService: CompanyContextService,
  ) {}

  /**
   * 폴더 구조를 가져온다 (트리 구조, 사용자용)
   */
  @Get('folders/structure')
  @ApiOperation({
    summary: '폴더 구조 조회 (사용자용)',
    description:
      '사용자가 접근 가능한 폴더 구조를 트리 형태로 조회합니다. ' +
      '전사공개 또는 사용자의 부서/직급/직책에 해당하는 폴더와 파일만 조회되며, 경로 정보(path, pathIds)도 함께 제공됩니다.',
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
    @CurrentUser() user: AuthenticatedUser,
    @Query('ancestorId') ancestorId?: string,
    @Query('excludeRoot') excludeRootParam?: string,
  ): Promise<WikiListResponseDto> {
    const excludeRoot = excludeRootParam === 'true';

    const items =
      await this.wikiBusinessService.폴더_구조를_가져온다(ancestorId, excludeRoot);

    // 사용자 권한 기반 필터링
    const filteredItems = await this.권한_기반으로_필터링한다(items, user);

    const tree = await this.buildTree(filteredItems);

    return {
      items: tree,
      total: filteredItems.length,
    };
  }

  /**
   * 평탄한 목록을 트리 구조로 변환하는 헬퍼 메서드
   */
  private async buildTree(items: WikiFileSystem[]): Promise<WikiResponseDto[]> {
    // 모든 아이템에서 createdBy, updatedBy 수집
    const allUserIds = items.flatMap(item => [item.createdBy, item.updatedBy]);
    const userNameMap = await this.사용자_이름_맵을_조회한다(allUserIds);

    const itemsByParent = new Map<string | null, WikiFileSystem[]>();
    for (const item of items) {
      const parentId = item.parentId || null;
      if (!itemsByParent.has(parentId)) {
        itemsByParent.set(parentId, []);
      }
      itemsByParent.get(parentId)!.push(item);
    }

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
        if (child.type === 'folder') {
          const subChildren = buildChildren(child.id);
          if (subChildren.length > 0) {
            childDto.children = subChildren;
          }
        }
        return childDto;
      });
    };

    const rootParentId =
      items.length > 0 && items[0].parentId ? items[0].parentId : null;
    return buildChildren(rootParentId);
  }

  /**
   * 인증된 사용자인지 확인하고 반환한다.
   * @Public() 데코레이터로 인해 user가 undefined일 수 있으므로, 인증이 필수인 엔드포인트에서 사용.
   */
  private 인증된_사용자를_확인한다(user: AuthenticatedUser | undefined): AuthenticatedUser {
    if (!user) {
      throw new UnauthorizedException('이 작업을 수행하려면 로그인이 필요합니다.');
    }
    return user;
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
   * 사용자의 권한 정보(직급/직책/부서)를 기반으로 위키 항목을 필터링한다.
   * 
   * 권한 정책 (Cascading):
   * - 폴더: 
   *   - 권한 설정(permissionRankIds/positionIds/departmentIds)이 있으면 매칭 체크
   *   - 권한 설정이 없으면 isPublic 값으로 판단 (true: 접근 가능, false: 접근 불가)
   * - 루트 파일 (parentId가 null):
   *   - 권한 설정(permissionRankIds/positionIds/departmentIds)이 있으면 매칭 체크
   *   - 권한 설정이 없으면 isPublic 값으로 판단 (true: 접근 가능, false: 접근 불가)
   * - 일반 파일 (parentId가 있는 경우): 상위 폴더의 권한을 상속받음
   * - 상위 폴더가 접근 불가하면 하위 항목도 모두 접근 불가
   */
  private async 권한_기반으로_필터링한다(
    items: WikiFileSystem[],
    user?: AuthenticatedUser,
  ): Promise<WikiFileSystem[]> {
    // 사용자의 직원 정보 조회 (직급/직책/부서 정보 포함)
    let employeeInfo: { rankId?: string; positionId?: string; departmentId?: string } = {};

    if (user?.employeeNumber) {
      try {
        const employee = await this.companyContextService.직원_정보를_조회한다(user.employeeNumber);
        if (employee) {
          employeeInfo = {
            rankId: employee.rankId || employee.rank?.id,
            positionId: employee.positionId || employee.position?.id,
            departmentId: employee.departmentId || employee.department?.id,
          };
          this.logger.log(`사용자 권한 정보 - employeeNumber: ${user.employeeNumber}, departmentId: ${employeeInfo.departmentId}, rankId: ${employeeInfo.rankId}, positionId: ${employeeInfo.positionId}`);
        }
      } catch (error) {
        this.logger.warn(`직원 정보 조회 실패 - employeeNumber: ${user.employeeNumber} (공개 항목만 표시)`, error);
      }
    } else {
      this.logger.warn('인증 정보 없음 - 공개 항목만 표시');
    }

    // 아이템 ID → 아이템 맵 구성
    const itemMap = new Map<string, WikiFileSystem>();
    for (const item of items) {
      itemMap.set(item.id, item);
    }

    // 접근 가능 여부 캐시 (중복 계산 방지)
    const accessCache = new Map<string, boolean>();

    return items.filter(item =>
      this.항목_접근_가능_여부(item, itemMap, accessCache, employeeInfo),
    );
  }

  /**
   * 단일 위키 항목에 대한 접근 가능 여부를 판단한다 (상위 폴더 체인 조회).
   * 파일 상세 조회 등 단일 항목 조회 시 사용.
   */
  private async 단일_항목_접근_가능_여부(
    item: WikiFileSystem,
    user?: AuthenticatedUser,
  ): Promise<boolean> {
    // 사용자의 직원 정보 조회
    let employeeInfo: { rankId?: string; positionId?: string; departmentId?: string } = {};

    if (user?.employeeNumber) {
      try {
        const employee = await this.companyContextService.직원_정보를_조회한다(user.employeeNumber);
        if (employee) {
          employeeInfo = {
            rankId: employee.rankId || employee.rank?.id,
            positionId: employee.positionId || employee.position?.id,
            departmentId: employee.departmentId || employee.department?.id,
          };
        }
      } catch (error) {
        this.logger.warn(`직원 정보 조회 실패 - employeeNumber: ${user.employeeNumber}`, error);
        return false;
      }
    }

    // 상위 폴더 체인 조회
    const ancestors = await this.wikiBusinessService.위키_경로를_조회한다(item.id);
    
    // 모든 상위 폴더에 대해 권한 체크 (루트부터 현재 항목까지)
    for (const ancestor of ancestors) {
      if (ancestor.type === 'folder') {
        // 권한 설정이 있는 폴더인지 확인
        const hasPermissionSettings = 
          (ancestor.permissionRankIds && ancestor.permissionRankIds.length > 0) ||
          (ancestor.permissionPositionIds && ancestor.permissionPositionIds.length > 0) ||
          (ancestor.permissionDepartmentIds && ancestor.permissionDepartmentIds.length > 0);

        if (hasPermissionSettings) {
          // 권한 설정이 있으면 매칭 체크
          const hasAccess = !!(
            (ancestor.permissionRankIds &&
              ancestor.permissionRankIds.length > 0 &&
              employeeInfo.rankId &&
              ancestor.permissionRankIds.includes(employeeInfo.rankId)) ||
            (ancestor.permissionPositionIds &&
              ancestor.permissionPositionIds.length > 0 &&
              employeeInfo.positionId &&
              ancestor.permissionPositionIds.includes(employeeInfo.positionId)) ||
            (ancestor.permissionDepartmentIds &&
              ancestor.permissionDepartmentIds.length > 0 &&
              employeeInfo.departmentId &&
              ancestor.permissionDepartmentIds.includes(employeeInfo.departmentId))
          );

          if (!hasAccess) {
            this.logger.debug(`접근 거부 - 상위 폴더 권한 없음: ${ancestor.name}`);
            return false;
          }
        }
      }
    }

    return true;
  }

  /**
   * 개별 위키 항목에 대한 접근 가능 여부를 판단한다 (인메모리 Cascading 체크).
   * 상위 폴더 결과를 캐싱하여 트리 전체를 효율적으로 검사한다.
   * 
   * 권한 체크 순서:
   * 1. 상위 폴더 체크 (parentId가 있는 경우)
   * 2. 폴더 또는 루트 파일: 자체 권한 설정 체크
   * 3. 일반 파일: 상위 폴더 권한 상속
   */
  private 항목_접근_가능_여부(
    item: WikiFileSystem,
    itemMap: Map<string, WikiFileSystem>,
    accessCache: Map<string, boolean>,
    employee: { rankId?: string; positionId?: string; departmentId?: string },
  ): boolean {
    if (accessCache.has(item.id)) {
      return accessCache.get(item.id)!;
    }

    // 상위 폴더 접근 권한 체크 (Cascading) - 먼저 상위 폴더 체크
    if (item.parentId && itemMap.has(item.parentId)) {
      const parent = itemMap.get(item.parentId)!;
      const parentAccess = this.항목_접근_가능_여부(parent, itemMap, accessCache, employee);
      if (!parentAccess) {
        this.logger.debug(`상위 폴더 접근 거부로 인한 접근 거부 - ${item.name} (부모: ${parent.name})`);
        accessCache.set(item.id, false);
        return false;
      }
    }

    // 폴더 또는 루트 파일: 권한 설정 체크
    if (item.type === 'folder' || !item.parentId) {
      // 권한 설정이 모두 비어있는지 확인
      const hasPermissionSettings = 
        (item.permissionRankIds && item.permissionRankIds.length > 0) ||
        (item.permissionPositionIds && item.permissionPositionIds.length > 0) ||
        (item.permissionDepartmentIds && item.permissionDepartmentIds.length > 0);

      if (!hasPermissionSettings) {
        // 권한 설정이 없으면 isPublic 값으로 판단
        if (item.isPublic) {
          this.logger.debug(`${item.type === 'folder' ? '폴더' : '루트 파일'} 접근 허용 (isPublic: true) - ${item.name}`);
          accessCache.set(item.id, true);
          return true;
        } else {
          this.logger.debug(`${item.type === 'folder' ? '폴더' : '루트 파일'} 접근 거부 (isPublic: false) - ${item.name}`);
          accessCache.set(item.id, false);
          return false;
        }
      }

      // 권한 설정이 있으면 직급/직책/부서 매칭 체크
      this.logger.debug(`${item.type === 'folder' ? '폴더' : '루트 파일'} 권한 체크 - ${item.name}, permissionDepartmentIds: ${JSON.stringify(item.permissionDepartmentIds)}, 사용자 departmentId: ${employee.departmentId}`);
      
      const hasDirectAccess = !!(
        (item.permissionRankIds &&
          item.permissionRankIds.length > 0 &&
          employee.rankId &&
          item.permissionRankIds.includes(employee.rankId)) ||
        (item.permissionPositionIds &&
          item.permissionPositionIds.length > 0 &&
          employee.positionId &&
          item.permissionPositionIds.includes(employee.positionId)) ||
        (item.permissionDepartmentIds &&
          item.permissionDepartmentIds.length > 0 &&
          employee.departmentId &&
          item.permissionDepartmentIds.includes(employee.departmentId))
      );

      this.logger.debug(`${item.type === 'folder' ? '폴더' : '루트 파일'} 접근 권한 - ${item.name}: ${hasDirectAccess}`);

      if (!hasDirectAccess) {
        accessCache.set(item.id, false);
        return false;
      }
    }

    // 일반 파일 (parentId가 있는 경우): 상위 폴더 권한을 따름 (여기까지 왔으면 상위 폴더가 접근 가능하므로 허용)
    this.logger.debug(`항목 접근 허용 - ${item.name} (type: ${item.type})`);
    accessCache.set(item.id, true);
    return true;
  }

  /**
   * 경로로 폴더를 조회한다 (사용자용)
   */
  @Get('folders/by-path')
  @ApiOperation({
    summary: '경로로 폴더 조회 (사용자용)',
    description:
      '폴더 경로로 폴더를 조회합니다. 접근 권한이 없으면 404를 반환하며, 경로 정보(path, pathIds)도 함께 제공됩니다.\n\n' +
      '**경로 형식**:\n' +
      '- `/폴더1` → 최상위의 "폴더1" 폴더\n' +
      '- `/폴더1/폴더2` → "폴더1" 하위의 "폴더2" 폴더\n\n' +
      '⚠️ **주의**: `/` 경로는 사용할 수 없습니다.',
  })
  @ApiResponse({
    status: 200,
    description: '폴더 조회 성공',
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
  async 경로로_폴더를_조회한다(
    @CurrentUser() user: AuthenticatedUser,
    @Query('path') path: string,
  ): Promise<WikiResponseDto> {
    const folder = await this.wikiBusinessService.경로로_폴더를_조회한다(path);
    
    // 사용자 권한 확인
    const hasAccess = await this.단일_항목_접근_가능_여부(folder, user);
    if (!hasAccess) {
      throw new NotFoundException('폴더를 찾을 수 없거나 접근 권한이 없습니다.');
    }
    
    const children = await this.wikiBusinessService.폴더_하위_항목을_조회한다(
      folder.id,
    );
    
    // 하위 항목도 권한 기반 필터링
    const filteredChildren = await this.권한_기반으로_필터링한다(children, user);
    
    // 경로 정보 조회 (이미 루트부터 정렬되어 있음)
    const breadcrumb = await this.wikiBusinessService.위키_경로를_조회한다(folder.id);
    const parents = breadcrumb.filter(item => item.id !== folder.id);
    
    const pathNames = parents.map(item => item.name);
    const pathIds = parents.map(item => item.id);
    
    // 사용자 이름 조회
    const allUserIds = [folder.createdBy, folder.updatedBy, ...filteredChildren.flatMap(c => [c.createdBy, c.updatedBy])];
    const userNameMap = await this.사용자_이름_맵을_조회한다(allUserIds);
    
    const createdByName = folder.createdBy ? userNameMap.get(folder.createdBy) || null : null;
    const updatedByName = folder.updatedBy ? userNameMap.get(folder.updatedBy) || null : null;
    
    return WikiResponseDto.from(folder, filteredChildren, pathNames, pathIds, createdByName, updatedByName);
  }

  /**
   * 폴더를 조회한다 (사용자용)
   */
  @Get('folders/:id')
  @ApiOperation({
    summary: '폴더 상세 조회 (사용자용)',
    description: '폴더 상세 정보와 하위 폴더/파일 목록을 조회합니다. 권한 설정에 맞는 대상 직원 정보도 포함됩니다.',
  })
  @ApiResponse({
    status: 200,
    description: '폴더 조회 성공 (대상 직원 정보 포함)',
    type: WikiResponseDto,
  })
  @ApiParam({ name: 'id', description: '폴더 ID' })
  async 폴더를_조회한다(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<WikiResponseDto> {
    // includeTargetEmployees를 true로 설정하여 대상 직원 정보 포함
    const folder = await this.wikiBusinessService.폴더를_조회한다(id, true);
    
    // 사용자 권한 확인
    const hasAccess = await this.단일_항목_접근_가능_여부(folder, user);
    if (!hasAccess) {
      throw new NotFoundException('폴더를 찾을 수 없거나 접근 권한이 없습니다.');
    }
    
    const children =
      await this.wikiBusinessService.폴더_하위_항목을_조회한다(id);
    
    // 하위 항목도 권한 기반 필터링
    const filteredChildren = await this.권한_기반으로_필터링한다(children, user);
    
    // 사용자 이름 조회
    const allUserIds = [folder.createdBy, folder.updatedBy, ...filteredChildren.flatMap(c => [c.createdBy, c.updatedBy])];
    const userNameMap = await this.사용자_이름_맵을_조회한다(allUserIds);
    
    const createdByName = folder.createdBy ? userNameMap.get(folder.createdBy) || null : null;
    const updatedByName = folder.updatedBy ? userNameMap.get(folder.updatedBy) || null : null;
    
    const result = WikiResponseDto.from(folder, filteredChildren, undefined, undefined, createdByName, updatedByName);
    
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
   * 폴더를 생성한다 (사용자용)
   */
  @Post('folders')
  @ApiOperation({
    summary: '폴더 생성 (사용자용)',
    description: '새로운 폴더를 생성합니다. 기본적으로 전사공개로 생성되며, 권한 설정을 통해 접근을 제한할 수 있습니다.',
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
    const authenticatedUser = this.인증된_사용자를_확인한다(user);
    const folder = await this.wikiBusinessService.폴더를_생성한다({
      name: dto.name,
      parentId: dto.parentId,
      isPublic: dto.isPublic ?? true,
      permissionRankIds: dto.permissionRankIds,
      permissionPositionIds: dto.permissionPositionIds,
      permissionDepartmentIds: dto.permissionDepartmentIds,
      order: dto.order,
      createdBy: authenticatedUser.id,
    });
    
    // 사용자 이름 조회
    const userNameMap = await this.사용자_이름_맵을_조회한다([folder.createdBy, folder.updatedBy]);
    const createdByName = folder.createdBy ? userNameMap.get(folder.createdBy) || null : null;
    const updatedByName = folder.updatedBy ? userNameMap.get(folder.updatedBy) || null : null;
    
    return WikiResponseDto.from(folder, undefined, undefined, undefined, createdByName, updatedByName);
  }

  /**
   * 폴더를 삭제한다 (사용자용)
   */
  @Delete('folders/:id')
  @ApiOperation({
    summary: '폴더 삭제 (사용자용)',
    description: '폴더 및 하위 모든 항목을 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '폴더 삭제 성공',
  })
  @ApiParam({ name: 'id', description: '폴더 ID' })
  async 폴더를_삭제한다(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    this.인증된_사용자를_확인한다(user);
    const success = await this.wikiBusinessService.폴더를_삭제한다(id);
    return { success };
  }

  /**
   * 폴더를 수정한다 (사용자용)
   */
  @Patch('folders/:id')
  @ApiOperation({
    summary: '폴더 수정 (사용자용)',
    description: '폴더 정보를 수정합니다.',
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
    const authenticatedUser = this.인증된_사용자를_확인한다(user);
    const folder = await this.wikiBusinessService.폴더를_수정한다(id, {
      name: dto.name,
      isPublic: dto.isPublic,
      permissionRankIds: dto.permissionRankIds,
      permissionPositionIds: dto.permissionPositionIds,
      permissionDepartmentIds: dto.permissionDepartmentIds,
      order: dto.order,
      updatedBy: authenticatedUser.id,
    });
    return WikiResponseDto.from(folder);
  }

  /**
   * 폴더 경로를 수정한다 (사용자용)
   */
  @Patch('folders/:id/path')
  @ApiOperation({
    summary: '폴더 경로 수정 (사용자용)',
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
    const authenticatedUser = this.인증된_사용자를_확인한다(user);
    const folder = await this.wikiBusinessService.폴더_경로를_수정한다(id, {
      parentId: dto.parentId,
      updatedBy: authenticatedUser.id,
    });
    return WikiResponseDto.from(folder);
  }

  /**
   * 폴더 이름을 수정한다 (사용자용)
   */
  @Patch('folders/:id/name')
  @ApiOperation({
    summary: '폴더 이름 수정 (사용자용)',
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
    const authenticatedUser = this.인증된_사용자를_확인한다(user);
    const folder = await this.wikiBusinessService.폴더_이름을_수정한다(id, {
      name: dto.name,
      updatedBy: authenticatedUser.id,
    });
    return WikiResponseDto.from(folder);
  }

  /**
   * 파일을 삭제한다 (사용자용)
   */
  @Delete('files/:id')
  @ApiOperation({
    summary: '파일 삭제 (사용자용)',
    description: '파일을 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '파일 삭제 성공',
  })
  @ApiParam({ name: 'id', description: '파일 ID' })
  async 파일을_삭제한다(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    this.인증된_사용자를_확인한다(user);
    const success = await this.wikiBusinessService.파일을_삭제한다(id);
    return { success };
  }

  /**
   * 위키 파일 첨부파일을 개별 삭제한다 (사용자용)
   */
  @Delete('files/:id/attachments')
  @ApiOperation({
    summary: '위키 파일 첨부파일 개별 삭제 (사용자용)',
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
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Query('fileUrl') fileUrl: string,
  ): Promise<WikiResponseDto> {
    this.인증된_사용자를_확인한다(user);
    const wiki =
      await this.wikiBusinessService.위키_첨부파일을_삭제한다(
        id,
        fileUrl,
      );

    return WikiResponseDto.from(wiki);
  }

  /**
   * 파일 경로를 수정한다 (사용자용)
   */
  @Patch('files/:id/path')
  @ApiOperation({
    summary: '파일 경로 수정 (사용자용)',
    description: '파일의 부모 폴더를 변경합니다.',
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
    const authenticatedUser = this.인증된_사용자를_확인한다(user);
    const file = await this.wikiBusinessService.파일_경로를_수정한다(id, {
      parentId: dto.parentId,
      updatedBy: authenticatedUser.id,
    });
    return WikiResponseDto.from(file);
  }

  /**
   * 파일들을 검색한다 (사용자용)
   */
  @Get('files/search')
  @ApiOperation({
    summary: '파일 검색 (사용자용)',
    description:
      '검색 텍스트로 파일을 검색합니다. 사용자가 접근 가능한 파일만 검색됩니다.',
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
    @CurrentUser() user: AuthenticatedUser,
    @Query('query') query: string,
  ): Promise<WikiSearchListResponseDto> {
    if (!query || query.trim().length === 0) {
      return { items: [], total: 0 };
    }

    const results = await this.wikiBusinessService.파일들을_검색한다(
      query.trim(),
    );

    // 사용자 권한 기반 필터링 (폴더 구조 조회와 동일한 패턴)
    // 각 검색 결과의 상위 폴더 경로를 기반으로 접근 가능 여부를 판단한다
    let employeeInfo: { rankId?: string; positionId?: string; departmentId?: string } = {};

    if (user?.employeeNumber) {
      try {
        const employee = await this.companyContextService.직원_정보를_조회한다(user.employeeNumber);
        if (employee) {
          employeeInfo = {
            rankId: employee.rankId || employee.rank?.id,
            positionId: employee.positionId || employee.position?.id,
            departmentId: employee.departmentId || employee.department?.id,
          };
        }
      } catch (error) {
        this.logger.warn(`직원 정보 조회 실패 - employeeNumber: ${user.employeeNumber} (공개 항목만 표시)`, error);
      }
    }

    const filteredResults = results.filter((result) => {
      // 상위 경로의 폴더들로 itemMap 구성 (항목_접근_가능_여부와 동일한 방식)
      const ancestorFolders = result.path.map(p => p.wiki);
      const allItems = [...ancestorFolders, result.wiki];

      const itemMap = new Map<string, WikiFileSystem>();
      for (const item of allItems) {
        itemMap.set(item.id, item);
      }

      const accessCache = new Map<string, boolean>();
      return this.항목_접근_가능_여부(result.wiki, itemMap, accessCache, employeeInfo);
    });

    return {
      items: filteredResults.map((result) =>
        WikiSearchResultDto.from(result.wiki, result.path),
      ),
      total: filteredResults.length,
    };
  }

  /**
   * 위키를 확장 검색한다 (사용자용, 파일 + 폴더)
   */
  @Get('search')
  @ApiOperation({
    summary: '확장 검색 (사용자용, 파일 + 폴더)',
    description:
      '검색 텍스트로 파일과 폴더를 모두 검색합니다. 사용자가 접근 가능한 항목만 검색됩니다.\n\n' +
      '기존 파일 검색(`GET /files/search`)과 달리 폴더도 함께 검색됩니다.\n\n' +
      '결과는 폴더가 먼저, 파일이 나중에 표시되며, 각각 수정일 기준 내림차순으로 정렬됩니다.',
  })
  @ApiResponse({
    status: 200,
    description: '확장 검색 성공',
    type: WikiSearchListResponseDto,
  })
  @ApiQuery({
    name: 'query',
    required: true,
    description: '검색 텍스트',
    example: '회의록',
  })
  async 위키를_확장_검색한다(
    @CurrentUser() user: AuthenticatedUser,
    @Query('query') query: string,
  ): Promise<WikiSearchListResponseDto> {
    if (!query || query.trim().length === 0) {
      return { items: [], total: 0 };
    }

    const results = await this.wikiBusinessService.위키를_확장_검색한다(
      query.trim(),
    );

    // 사용자 권한 기반 필터링
    let employeeInfo: { rankId?: string; positionId?: string; departmentId?: string } = {};

    if (user?.employeeNumber) {
      try {
        const employee = await this.companyContextService.직원_정보를_조회한다(user.employeeNumber);
        if (employee) {
          employeeInfo = {
            rankId: employee.rankId || employee.rank?.id,
            positionId: employee.positionId || employee.position?.id,
            departmentId: employee.departmentId || employee.department?.id,
          };
        }
      } catch (error) {
        this.logger.warn(`직원 정보 조회 실패 - employeeNumber: ${user.employeeNumber} (공개 항목만 표시)`, error);
      }
    }

    const filteredResults = results.filter((result) => {
      const ancestorFolders = result.path.map(p => p.wiki);
      const allItems = [...ancestorFolders, result.wiki];

      const itemMap = new Map<string, WikiFileSystem>();
      for (const item of allItems) {
        itemMap.set(item.id, item);
      }

      const accessCache = new Map<string, boolean>();
      return this.항목_접근_가능_여부(result.wiki, itemMap, accessCache, employeeInfo);
    });

    return {
      items: filteredResults.map((result) =>
        WikiSearchResultDto.from(result.wiki, result.path),
      ),
      total: filteredResults.length,
    };
  }

  /**
   * 파일들을 조회한다 (사용자용)
   */
  @Get('files')
  @ApiOperation({
    summary: '파일 목록 조회 (사용자용)',
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
    @CurrentUser() user: AuthenticatedUser,
    @Query('parentId') parentId?: string,
  ): Promise<WikiListResponseDto> {
    const items = await this.wikiBusinessService.파일들을_조회한다(
      parentId || null,
    );

    // 사용자 권한 기반 필터링
    const filteredItems = await this.권한_기반으로_필터링한다(items, user);

    // 사용자 이름 조회
    const allUserIds = filteredItems.flatMap(item => [item.createdBy, item.updatedBy]);
    const userNameMap = await this.사용자_이름_맵을_조회한다(allUserIds);

    return {
      items: filteredItems.map((item) => {
        const createdByName = item.createdBy ? userNameMap.get(item.createdBy) || null : null;
        const updatedByName = item.updatedBy ? userNameMap.get(item.updatedBy) || null : null;
        return WikiResponseDto.from(item, undefined, undefined, undefined, createdByName, updatedByName);
      }),
      total: filteredItems.length,
    };
  }

  /**
   * 파일을 조회한다 (사용자용)
   */
  @Get('files/:id')
  @ApiOperation({
    summary: '파일 상세 조회 (사용자용)',
    description: '파일 상세 정보를 조회합니다. 권한 설정에 맞는 대상 직원 정보도 포함됩니다.',
  })
  @ApiResponse({
    status: 200,
    description: '파일 조회 성공 (대상 직원 정보 포함)',
    type: WikiResponseDto,
  })
  @ApiParam({ name: 'id', description: '파일 ID' })
  async 파일을_조회한다(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<WikiResponseDto> {
    // includeTargetEmployees를 true로 설정하여 대상 직원 정보 포함
    const file = await this.wikiBusinessService.파일을_조회한다(id, true);
    
    // 사용자 권한 확인
    const hasAccess = await this.단일_항목_접근_가능_여부(file, user);
    if (!hasAccess) {
      throw new NotFoundException('파일을 찾을 수 없거나 접근 권한이 없습니다.');
    }
    
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
   * 빈 파일을 생성한다 (사용자용)
   */
  @Post('files/empty')
  @ApiOperation({
    summary: '빈 파일 생성 (사용자용)',
    description: '빈 파일을 생성합니다. 기본적으로 전사공개로 생성됩니다.\n\n⚠️ **parentId**: 없으면 자동으로 루트 폴더 하위에 생성됩니다.',
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
    const authenticatedUser = this.인증된_사용자를_확인한다(user);

    if (typeof dto.name !== 'string') {
      throw new BadRequestException('name 필드는 문자열이어야 합니다.');
    }

    if (dto.isPublic !== undefined && typeof dto.isPublic !== 'boolean') {
      throw new BadRequestException('isPublic 필드는 boolean 값이어야 합니다.');
    }

    const file = await this.wikiBusinessService.빈_파일을_생성한다(
      dto.name,
      dto.parentId || null,
      authenticatedUser.id,
      dto.isPublic,
      dto.permissionRankIds,
      dto.permissionPositionIds,
      dto.permissionDepartmentIds,
    );
    return WikiResponseDto.from(file);
  }

  /**
   * 파일을 생성한다 (사용자용)
   */
  @Post('files')
  @ApiOperation({
    summary: '파일 생성 (사용자용)',
    description:
      '새로운 파일을 생성합니다.\n\n' +
      '**파일 업로드 방식**: Presigned URL을 통해 S3에 직접 업로드 후, 반환된 fileUrl을 attachments에 포함하여 전송합니다.\n\n' +
      '⚠️ **parentId**: 없으면 자동으로 루트 폴더 하위에 생성됩니다.',
  })
  @ApiResponse({
    status: 201,
    description: '파일 생성 성공',
    type: WikiResponseDto,
  })
  async 파일을_생성한다(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateFileDto,
  ): Promise<WikiResponseDto> {
    const authenticatedUser = this.인증된_사용자를_확인한다(user);
    const file = await this.wikiBusinessService.파일을_생성한다(
      dto.name,
      dto.parentId || null,
      dto.title || null,
      dto.content || null,
      authenticatedUser.id,
      dto.attachments,
      dto.isPublic,
      dto.permissionRankIds,
      dto.permissionPositionIds,
      dto.permissionDepartmentIds,
    );
    return WikiResponseDto.from(file);
  }

  /**
   * 파일을 수정한다 (사용자용)
   */
  @Put('files/:id')
  @ApiOperation({
    summary: '파일 수정 (사용자용)',
    description:
      '파일 정보를 수정합니다.\n\n' +
      '**파일 업로드 방식**: Presigned URL을 통해 S3에 직접 업로드 후, 반환된 fileUrl을 attachments에 포함하여 전송합니다.\n\n' +
      '**파일 관리 방식**:\n' +
      '- `attachments`를 전송하면: 기존 첨부파일 유지 + 새 파일들 추가\n' +
      '- `attachments`를 전송하지 않으면: 기존 첨부파일 유지 (변경 없음)\n' +
      '- 개별 파일 삭제는 별도 엔드포인트(`DELETE /files/:id/attachments`) 사용',
  })
  @ApiResponse({
    status: 200,
    description: '파일 수정 성공',
    type: WikiResponseDto,
  })
  @ApiParam({ name: 'id', description: '파일 ID' })
  @ApiBody({
    description: '파일 수정 데이터 (JSON)',
    schema: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string', description: '파일명', example: '수정된 파일명' },
        title: { type: 'string', description: '문서 제목', nullable: true },
        content: { type: 'string', description: '문서 본문', nullable: true },
        isPublic: { type: 'boolean', description: '공개 여부' },
        permissionRankIds: { type: 'array', items: { type: 'string' }, description: '직급 ID 목록' },
        permissionPositionIds: { type: 'array', items: { type: 'string' }, description: '직책 ID 목록' },
        permissionDepartmentIds: { type: 'array', items: { type: 'string' }, description: '부서 ID 목록' },
        attachments: {
          type: 'array',
          description: 'S3 Presigned URL로 업로드 완료 후 전달할 첨부파일 메타데이터',
          items: {
            type: 'object',
            properties: {
              fileName: { type: 'string', example: '회의록.pdf' },
              fileUrl: { type: 'string', example: 'https://bucket.s3.ap-northeast-2.amazonaws.com/dev/wiki/uuid.pdf' },
              fileSize: { type: 'number', example: 1024000 },
              mimeType: { type: 'string', example: 'application/pdf' },
            },
          },
        },
      },
    },
  })
  async 파일을_수정한다(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: any,
  ): Promise<WikiResponseDto> {
    const authenticatedUser = this.인증된_사용자를_확인한다(user);

    const { 
      name, 
      title, 
      content, 
      isPublic,
      permissionRankIds,
      permissionPositionIds,
      permissionDepartmentIds,
      attachments,
    } = body;

    if (!name) {
      throw new BadRequestException('name 필드는 필수입니다.');
    }

    const file = await this.wikiBusinessService.파일을_수정한다(
      id,
      name,
      title || null,
      content || null,
      authenticatedUser.id,
      attachments,
      isPublic,
      permissionRankIds,
      permissionPositionIds,
      permissionDepartmentIds,
    );
    return WikiResponseDto.from(file);
  }

  // ==========================================
  // 접근 가능 여부 확인 (생성 전 프리뷰)
  // ==========================================

  /**
   * 파일/폴더 생성 시 현재 사용자가 접근 가능한지 미리 확인한다.
   * 
   * 프론트엔드에서 파일/폴더 생성 폼에서 주기적으로 호출하여,
   * 해당 설정(상위 폴더, 공개 여부, 권한 설정)으로 생성했을 때
   * 현재 사용자가 접근할 수 있는지 경고를 제공합니다.
   * 
   * 검사 범위:
   * 1. 상위 폴더 전체 체인 (루트 → ... → 직접 상위 폴더) - Cascading 방식
   * 2. 생성하려는 항목 자체의 권한 설정
   */
  @Post('check-access')
  @ApiOperation({
    summary: '파일/폴더 생성 시 접근 가능 여부 미리 확인',
    description:
      '파일 또는 폴더를 생성하기 전에 현재 설정으로 생성했을 때 ' +
      '현재 사용자가 해당 항목에 접근할 수 있는지 미리 확인합니다.\n\n' +
      '**확인 항목**:\n' +
      '1. **상위 폴더 전체 체인** (Cascading): 루트부터 직접 상위 폴더까지 모든 조상 폴더의 권한을 순차적으로 확인합니다. ' +
      '어느 한 단계라도 접근 불가하면 그 하위의 모든 항목도 접근 불가합니다.\n' +
      '2. **생성 항목 자체 권한**: 폴더의 경우 설정하려는 권한에 현재 사용자가 포함되는지, ' +
      '파일의 경우 isPublic 설정을 확인합니다.\n\n' +
      '**응답에 포함되는 정보**:\n' +
      '- `ancestorPath`: 상위 폴더 전체 경로와 각 폴더별 접근 가능 여부\n' +
      '- `details`: 접근 불가 원인 상세 (출처, 계층 깊이, 사유)\n\n' +
      '**사용 시나리오**: 프론트엔드에서 생성 폼의 설정이 변경될 때마다 호출하여 경고 UI를 표시합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '접근 가능 여부 확인 결과',
    type: CheckWikiAccessResponseDto,
    content: {
      'application/json': {
        examples: {
          accessible: {
            summary: '접근 가능',
            description: '모든 상위 폴더와 자체 권한을 통과한 경우',
            value: {
              accessible: true,
              ancestorPath: [
                { id: 'uuid-root', name: '전사 문서', depth: 0, accessible: true },
                { id: 'uuid-parent', name: '개발팀', depth: 1, accessible: true },
              ],
            },
          },
          blockedByAncestor: {
            summary: '상위 폴더 권한으로 접근 불가',
            description: '상위 폴더 체인 중 접근 불가한 폴더가 있는 경우 (Cascading 차단)',
            value: {
              accessible: false,
              warning: "상위 폴더 '경영전략팀 전용'의 권한 설정으로 인해 접근이 제한됩니다.",
              ancestorPath: [
                { id: 'uuid-root', name: '전사 문서', depth: 0, accessible: true },
                { id: 'uuid-dept', name: '경영전략팀 전용', depth: 1, accessible: false },
                { id: 'uuid-sub', name: '기밀 문서', depth: 2, accessible: false },
              ],
              details: [
                {
                  source: 'ancestor',
                  folderId: 'uuid-dept',
                  folderName: '경영전략팀 전용',
                  depth: 1,
                  reason: "폴더 '경영전략팀 전용'의 부서 권한에 현재 사용자가 포함되지 않습니다. (이로 인해 하위 1단계 폴더도 접근 불가)",
                },
              ],
            },
          },
          blockedBySelf: {
            summary: '자체 권한으로 접근 불가',
            description: '생성하려는 항목의 권한 설정에 현재 사용자가 포함되지 않는 경우',
            value: {
              accessible: false,
              warning: '현재 설정한 권한으로 인해 생성 후 접근할 수 없습니다.',
              details: [
                {
                  source: 'self',
                  folderId: '',
                  folderName: '(새로 생성할 폴더)',
                  depth: -1,
                  reason: '부서/직급 권한에 현재 사용자가 포함되지 않습니다.',
                },
              ],
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 필요',
  })
  @ApiBody({
    type: CheckWikiAccessDto,
    examples: {
      folderInParent: {
        summary: '상위 폴더 안에 폴더 생성',
        description: '특정 상위 폴더 안에 부서 제한 폴더를 생성하는 경우',
        value: {
          parentId: 'uuid-of-parent-folder',
          type: 'folder',
          isPublic: false,
          permissionDepartmentIds: ['uuid-of-department'],
        },
      },
      fileInParent: {
        summary: '상위 폴더 안에 파일 생성',
        description: '특정 상위 폴더 안에 공개 파일을 생성하는 경우',
        value: {
          parentId: 'uuid-of-parent-folder',
          type: 'file',
          isPublic: true,
        },
      },
      rootFolder: {
        summary: '최상위에 폴더 생성',
        description: '최상위 레벨에 전사공개 폴더를 생성하는 경우',
        value: {
          type: 'folder',
          isPublic: true,
        },
      },
    },
  })
  async 접근_가능_여부를_확인한다(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CheckWikiAccessDto,
  ): Promise<CheckWikiAccessResponseDto> {
    const authenticatedUser = this.인증된_사용자를_확인한다(user);

    // 1. 사용자의 직원 정보 조회 (폴더 구조 조회와 동일한 패턴)
    let employeeInfo: { rankId?: string; positionId?: string; departmentId?: string } = {};

    if (authenticatedUser.employeeNumber) {
      try {
        const employee = await this.companyContextService.직원_정보를_조회한다(authenticatedUser.employeeNumber);
        if (employee) {
          employeeInfo = {
            rankId: employee.rankId || employee.rank?.id,
            positionId: employee.positionId || employee.position?.id,
            departmentId: employee.departmentId || employee.department?.id,
          };
          this.logger.log(`접근 확인 - 사용자 권한 정보: departmentId=${employeeInfo.departmentId}, rankId=${employeeInfo.rankId}, positionId=${employeeInfo.positionId}`);
        }
      } catch (error) {
        this.logger.warn(`직원 정보 조회 실패 - employeeNumber: ${authenticatedUser.employeeNumber}`, error);
        return {
          accessible: false,
          warning: '사용자 정보를 조회할 수 없어 접근 가능 여부를 확인할 수 없습니다.',
        };
      }
    }

    const warnings: WikiAccessWarningDto[] = [];
    const ancestorPath: AncestorPathItemDto[] = [];

    // 2. 상위 폴더 전체 체인을 가져와서 항목_접근_가능_여부와 동일한 로직으로 판단
    //    핵심: 폴더 구조 조회(항목_접근_가능_여부)와 완전히 동일한 방식으로 Cascading 체크
    //
    //    - 상위 폴더가 모두 공개(isPublic:true, 권한설정 없음) → 하위 항목 무조건 접근 가능
    //    - 상위 폴더 중 하나라도 차단 → 그 이하 전부 접근 불가 (Cascading)
    //    - 파일(parentId 있음): 상위 폴더 접근 가능하면 파일도 접근 가능 (파일 자체 권한 안 봄)
    //    - 폴더: 상위 폴더 접근 가능 + 자체 권한 체크
    //    - 루트 항목(parentId 없음): 자체 권한만 체크

    let parentAccessible = true; // 상위 폴더 체인의 최종 접근 가능 여부

    if (dto.parentId) {
      try {
        // 위키_경로를_조회한다: 루트 → ... → parentId 까지의 전체 경로를 반환
        const ancestors = await this.wikiBusinessService.위키_경로를_조회한다(dto.parentId);

        this.logger.log(
          `접근 확인 - 상위 폴더 체인 ${ancestors.length}단계: ` +
          `[${ancestors.map(a => `${a.name}(depth:${a.depth})`).join(' → ')}]`,
        );

        // 항목_접근_가능_여부와 동일한 방식으로 인메모리 맵 구성 후 Cascading 체크
        const itemMap = new Map<string, WikiFileSystem>();
        for (const ancestor of ancestors) {
          itemMap.set(ancestor.id, ancestor);
        }
        const accessCache = new Map<string, boolean>();

        // 모든 조상 폴더에 대해 항목_접근_가능_여부 실행 (동일한 로직 재사용)
        for (const ancestor of ancestors) {
          const accessible = this.항목_접근_가능_여부(ancestor, itemMap, accessCache, employeeInfo);

          ancestorPath.push({
            id: ancestor.id,
            name: ancestor.name,
            depth: ancestor.depth,
            accessible,
          });
        }

        // 직접 상위 폴더(parentId)의 접근 가능 여부가 최종 결과
        const parentFolder = ancestors.find(a => a.id === dto.parentId);
        if (parentFolder) {
          parentAccessible = accessCache.get(parentFolder.id) ?? true;
        }

        // 접근 불가한 조상 폴더들에 대한 경고 수집
        if (!parentAccessible) {
          // Cascading 차단: 처음 차단된 폴더를 찾아서 경고 생성
          let firstBlockedIndex = -1;
          for (let i = 0; i < ancestors.length; i++) {
            const ancestor = ancestors[i];
            const accessible = accessCache.get(ancestor.id) ?? true;
            if (!accessible) {
              if (firstBlockedIndex === -1) firstBlockedIndex = i;

              // 처음 차단된 폴더만 상세 사유를 제공 (나머지는 Cascading)
              if (i === firstBlockedIndex) {
                const reason = this.항목_차단_사유를_구한다(ancestor, itemMap, employeeInfo);
                const remainingCount = ancestors.length - i - 1;
                const cascadeNote = remainingCount > 0
                  ? ` (이로 인해 하위 ${remainingCount}단계도 접근 불가)`
                  : '';

                warnings.push({
                  source: 'ancestor',
                  folderId: ancestor.id,
                  folderName: ancestor.name,
                  depth: ancestor.depth,
                  reason: `${reason}${cascadeNote}`,
                });
              }
            }
          }
        }
      } catch (error) {
        this.logger.warn(`상위 폴더 조회 실패 - parentId: ${dto.parentId}`, error);
        parentAccessible = false;
        warnings.push({
          source: 'ancestor',
          folderId: dto.parentId,
          folderName: '(알 수 없음)',
          depth: -1,
          reason: '상위 폴더를 찾을 수 없습니다. 유효한 폴더 ID인지 확인해주세요.',
        });
      }
    }

    // 3. 생성하려는 항목 자체의 접근 가능 여부 판단
    //    항목_접근_가능_여부와 동일한 로직:
    //    - 상위 폴더가 차단됨 → 무조건 접근 불가 (이미 warnings에 추가됨)
    //    - 파일(parentId 있음): 상위 폴더가 접근 가능하면 → 파일도 접근 가능 (자체 권한 안 봄)
    //    - 폴더 또는 루트 항목: 자체 권한 설정 체크
    let selfAccessible = true;

    if (!parentAccessible) {
      // 상위 폴더가 이미 차단됨 → 어떤 설정이든 접근 불가
      selfAccessible = false;
    } else if (dto.type === WikiFileSystemType.FILE && dto.parentId) {
      // 파일(parentId 있음): 상위 폴더가 접근 가능하면 → 파일도 접근 가능
      // 항목_접근_가능_여부에서 "일반 파일은 상위 폴더 권한을 따름"과 동일
      selfAccessible = true;
      this.logger.debug('접근 확인 - 파일: 상위 폴더가 접근 가능하므로 파일도 접근 가능');
    } else {
      // 폴더 또는 루트 항목(parentId 없음): 자체 권한 설정 체크
      // 항목_접근_가능_여부의 "폴더 또는 루트 파일: 권한 설정 체크"와 동일
      const itemIsPublic = dto.isPublic ?? true;
      const hasItemPermissions =
        (dto.permissionRankIds && dto.permissionRankIds.length > 0) ||
        (dto.permissionPositionIds && dto.permissionPositionIds.length > 0) ||
        (dto.permissionDepartmentIds && dto.permissionDepartmentIds.length > 0);

      if (!hasItemPermissions) {
        // 권한 설정 없음 → isPublic으로 판단
        if (itemIsPublic) {
          selfAccessible = true;
        } else {
          selfAccessible = false;
          const typeName = dto.type === WikiFileSystemType.FOLDER ? '폴더' : '파일';
          warnings.push({
            source: 'self',
            folderId: '',
            folderName: `(새로 생성할 ${typeName})`,
            depth: -1,
            reason: `${typeName}을(를) 비공개(isPublic: false)로 설정하고 권한을 지정하지 않으면 누구도 접근할 수 없습니다.`,
          });
        }
      } else {
        // 권한 설정 있음 → 직급/직책/부서 매칭 체크 (OR 조건)
        const hasDirectAccess = !!(
          (dto.permissionRankIds &&
            dto.permissionRankIds.length > 0 &&
            employeeInfo.rankId &&
            dto.permissionRankIds.includes(employeeInfo.rankId)) ||
          (dto.permissionPositionIds &&
            dto.permissionPositionIds.length > 0 &&
            employeeInfo.positionId &&
            dto.permissionPositionIds.includes(employeeInfo.positionId)) ||
          (dto.permissionDepartmentIds &&
            dto.permissionDepartmentIds.length > 0 &&
            employeeInfo.departmentId &&
            dto.permissionDepartmentIds.includes(employeeInfo.departmentId))
        );

        if (hasDirectAccess) {
          selfAccessible = true;
        } else {
          selfAccessible = false;
          const restrictionParts: string[] = [];
          if (dto.permissionDepartmentIds && dto.permissionDepartmentIds.length > 0) restrictionParts.push('부서');
          if (dto.permissionRankIds && dto.permissionRankIds.length > 0) restrictionParts.push('직급');
          if (dto.permissionPositionIds && dto.permissionPositionIds.length > 0) restrictionParts.push('직책');

          const typeName = dto.type === WikiFileSystemType.FOLDER ? '폴더' : '파일';
          warnings.push({
            source: 'self',
            folderId: '',
            folderName: `(새로 생성할 ${typeName})`,
            depth: -1,
            reason: `설정한 ${restrictionParts.join('/')} 권한에 현재 사용자가 포함되지 않습니다.`,
          });
        }
      }
    }

    // 4. 응답 구성
    const isAccessible = parentAccessible && selfAccessible;

    if (isAccessible) {
      return {
        accessible: true,
        ancestorPath: ancestorPath.length > 0 ? ancestorPath : undefined,
      };
    }

    // 경고 메시지 구성
    const warningMessages: string[] = [];
    const ancestorWarnings = warnings.filter(w => w.source === 'ancestor');
    const selfWarnings = warnings.filter(w => w.source === 'self');

    if (ancestorWarnings.length > 0) {
      const blockingFolderNames = ancestorWarnings.map(w => `'${w.folderName}'`).join(', ');
      warningMessages.push(
        `상위 폴더 ${blockingFolderNames}의 권한 설정으로 인해 접근이 제한됩니다.`,
      );
    }
    if (selfWarnings.length > 0) {
      warningMessages.push('현재 설정한 권한으로 인해 생성 후 접근할 수 없습니다.');
    }

    return {
      accessible: false,
      warning: warningMessages.join(' ') || '이 설정으로 생성하면 현재 사용자가 해당 항목에 접근할 수 없습니다.',
      ancestorPath: ancestorPath.length > 0 ? ancestorPath : undefined,
      details: warnings,
    };
  }

  // ==========================================
  // 접근 확인 헬퍼: 차단 사유 추출
  // ==========================================

  /**
   * 항목이 차단된 사유를 구한다.
   * 항목_접근_가능_여부 로직을 기반으로 왜 차단되었는지 사유를 반환한다.
   */
  private 항목_차단_사유를_구한다(
    item: WikiFileSystem,
    itemMap: Map<string, WikiFileSystem>,
    employee: { rankId?: string; positionId?: string; departmentId?: string },
  ): string {
    // 상위 폴더가 차단되어 Cascading으로 차단된 경우
    if (item.parentId && itemMap.has(item.parentId)) {
      const parentCache = new Map<string, boolean>();
      const parentAccessible = this.항목_접근_가능_여부(
        itemMap.get(item.parentId)!, itemMap, parentCache, employee,
      );
      if (!parentAccessible) {
        return `상위 폴더가 접근 불가하여 Cascading으로 차단되었습니다.`;
      }
    }

    // 자체 권한으로 차단된 경우
    if (item.type === 'folder' || !item.parentId) {
      const hasPermissionSettings =
        (item.permissionRankIds && item.permissionRankIds.length > 0) ||
        (item.permissionPositionIds && item.permissionPositionIds.length > 0) ||
        (item.permissionDepartmentIds && item.permissionDepartmentIds.length > 0);

      if (!hasPermissionSettings) {
        if (!item.isPublic) {
          return `폴더 '${item.name}'이(가) 비공개(isPublic: false)로 설정되어 있어 접근할 수 없습니다.`;
        }
      } else {
        const restrictionParts: string[] = [];
        if (item.permissionDepartmentIds && item.permissionDepartmentIds.length > 0) restrictionParts.push('부서');
        if (item.permissionRankIds && item.permissionRankIds.length > 0) restrictionParts.push('직급');
        if (item.permissionPositionIds && item.permissionPositionIds.length > 0) restrictionParts.push('직책');
        return `폴더 '${item.name}'의 ${restrictionParts.join('/')} 권한에 현재 사용자가 포함되지 않습니다.`;
      }
    }

    return `항목 '${item.name}'에 접근할 수 없습니다.`;
  }
}
