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
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
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
} from '@interface/common/dto/wiki/wiki.dto';

@ApiTags('U-2. 사용자 - Wiki')
@ApiBearerAuth('Bearer')
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

    // TODO: 사용자 권한 필터링 로직 구현 필요
    const items =
      await this.wikiBusinessService.폴더_구조를_가져온다(ancestorId, excludeRoot);

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
    // TODO: 사용자 권한 확인 로직 구현 필요
    const folder = await this.wikiBusinessService.경로로_폴더를_조회한다(path);
    const children = await this.wikiBusinessService.폴더_하위_항목을_조회한다(
      folder.id,
    );
    
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
    // TODO: 사용자 권한 확인 로직 구현 필요
    // includeTargetEmployees를 true로 설정하여 대상 직원 정보 포함
    const folder = await this.wikiBusinessService.폴더를_조회한다(id, true);
    const children =
      await this.wikiBusinessService.폴더_하위_항목을_조회한다(id);
    
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
    // TODO: 사용자 권한 확인 로직 구현 필요 (부모 폴더 생성 권한)
    const folder = await this.wikiBusinessService.폴더를_생성한다({
      name: dto.name,
      parentId: dto.parentId,
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
    // TODO: 사용자 권한 확인 로직 구현 필요 (작성자 확인 또는 관리 권한)
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
    // TODO: 사용자 권한 확인 로직 구현 필요
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
    // TODO: 사용자 권한 확인 로직 구현 필요
    const folder = await this.wikiBusinessService.폴더_경로를_수정한다(id, {
      parentId: dto.parentId,
      updatedBy: user.id,
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
    // TODO: 사용자 권한 확인 로직 구현 필요
    const folder = await this.wikiBusinessService.폴더_이름을_수정한다(id, {
      name: dto.name,
      updatedBy: user.id,
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
    // TODO: 사용자 권한 확인 로직 구현 필요
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
    // TODO: 사용자 권한 확인 로직 구현 필요
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
    // TODO: 사용자 권한 확인 로직 구현 필요
    const file = await this.wikiBusinessService.파일_경로를_수정한다(id, {
      parentId: dto.parentId,
      updatedBy: user.id,
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

    // TODO: 사용자 권한 필터링 로직 구현 필요
    const results = await this.wikiBusinessService.파일들을_검색한다(
      query.trim(),
    );

    return {
      items: results.map((result) =>
        WikiSearchResultDto.from(result.wiki, result.path),
      ),
      total: results.length,
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
    // TODO: 사용자 권한 필터링 로직 구현 필요
    const items = await this.wikiBusinessService.파일들을_조회한다(
      parentId || null,
    );

    return {
      items: items.map((item) => WikiResponseDto.from(item)),
      total: items.length,
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
    // TODO: 사용자 권한 확인 로직 구현 필요
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
    if (typeof dto.name !== 'string') {
      throw new BadRequestException('name 필드는 문자열이어야 합니다.');
    }

    if (dto.isPublic !== undefined && typeof dto.isPublic !== 'boolean') {
      throw new BadRequestException('isPublic 필드는 boolean 값이어야 합니다.');
    }

    // TODO: 사용자 권한 확인 로직 구현 필요
    const file = await this.wikiBusinessService.빈_파일을_생성한다(
      dto.name,
      dto.parentId || null,
      user.id,
      dto.isPublic,
    );
    return WikiResponseDto.from(file);
  }

  /**
   * 파일을 생성한다 (사용자용)
   */
  @Post('files')
  @UseInterceptors(
    FilesInterceptor('files', undefined, {
      fileFilter: (req, file, callback) => {
        callback(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '파일 생성 (사용자용)',
    description: '새로운 파일을 생성합니다. 첨부파일 업로드 가능.\n\n⚠️ **parentId**: 없으면 자동으로 루트 폴더 하위에 생성됩니다.',
  })
  @ApiBody({
    description: 'name은 필수입니다.',
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
        },
        title: {
          type: 'string',
          description: '문서 제목 (선택)',
        },
        content: {
          type: 'string',
          description: '문서 본문 (선택)',
        },
        isPublic: {
          type: 'boolean',
          description: '공개 여부 (선택, 기본값: true)',
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
  async 파일을_생성한다(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateFileDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<WikiResponseDto> {
    // TODO: 사용자 권한 확인 로직 구현 필요
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
  }

  /**
   * 파일을 수정한다 (사용자용)
   */
  @Put('files/:id')
  @UseInterceptors(
    FilesInterceptor('files', undefined, {
      fileFilter: (req, file, callback) => {
        callback(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '파일 수정 (사용자용)',
    description: '파일 정보를 수정합니다. 첨부파일 업로드 가능.',
  })
  @ApiBody({
    description: 'name은 필수입니다.',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: '파일명',
        },
        title: {
          type: 'string',
          description: '문서 제목 (선택)',
        },
        content: {
          type: 'string',
          description: '문서 본문 (선택)',
        },
        isPublic: {
          type: 'boolean',
          description: '공개 여부 (선택, true: 상위 폴더 권한 cascading, false: 완전 비공개)',
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
    status: 200,
    description: '파일 수정 성공',
    type: WikiResponseDto,
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

    // TODO: 사용자 권한 확인 로직 구현 필요
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
}
