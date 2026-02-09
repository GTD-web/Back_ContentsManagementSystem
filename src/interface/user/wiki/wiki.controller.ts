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
  constructor(private readonly wikiBusinessService: WikiBusinessService) {}

  /**
   * 폴더 구조를 가져온다 (트리 구조, 사용자용)
   */
  @Get('folders/structure')
  @ApiOperation({
    summary: '폴더 구조 조회 (사용자용)',
    description:
      '사용자가 접근 가능한 폴더 구조를 트리 형태로 조회합니다. ' +
      '전사공개 또는 사용자의 부서/직급/직책에 해당하는 폴더와 파일만 조회됩니다.',
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
    description: '조상 폴더 ID (없으면 루트부터)',
    example: 'uuid-of-ancestor-folder',
  })
  @ApiQuery({
    name: 'excludeRoot',
    required: false,
    type: Boolean,
    description: '루트 폴더 제외 여부 (true: 루트 폴더 제외, false: 포함)',
    example: true,
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
  private async buildTree(items: any[]): Promise<WikiResponseDto[]> {
    const itemsByParent = new Map<string | null, any[]>();
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
        
        const childDto = WikiResponseDto.from(child, undefined, path, pathIds);
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
   * 경로로 폴더를 조회한다 (사용자용)
   */
  @Get('folders/by-path')
  @ApiOperation({
    summary: '경로로 폴더 조회 (사용자용)',
    description:
      '폴더 경로로 폴더를 조회합니다. 접근 권한이 없으면 404를 반환합니다.\n\n' +
      '**경로 형식**:\n' +
      '- `/` → 루트 폴더 반환 (시스템 자동 생성)\n' +
      '- `/폴더1/폴더2` 또는 `폴더1/폴더2` → 루트 하위의 폴더 경로',
  })
  @ApiResponse({
    status: 200,
    description: '폴더 조회 성공',
    type: WikiResponseDto,
  })
  @ApiQuery({
    name: 'path',
    description: '폴더 경로 (예: / 또는 /폴더1/폴더2)',
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
    
    return WikiResponseDto.from(folder, children, pathNames, pathIds);
  }

  /**
   * 폴더를 조회한다 (사용자용)
   */
  @Get('folders/:id')
  @ApiOperation({
    summary: '폴더 상세 조회 (사용자용)',
    description: '폴더 상세 정보와 하위 폴더/파일 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '폴더 조회 성공',
    type: WikiResponseDto,
  })
  @ApiParam({ name: 'id', description: '폴더 ID' })
  async 폴더를_조회한다(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<WikiResponseDto> {
    // TODO: 사용자 권한 확인 로직 구현 필요
    const folder = await this.wikiBusinessService.폴더를_조회한다(id);
    const children =
      await this.wikiBusinessService.폴더_하위_항목을_조회한다(id);
    return WikiResponseDto.from(folder, children);
  }

  /**
   * 폴더를 생성한다 (사용자용)
   */
  @Post('folders')
  @ApiOperation({
    summary: '폴더 생성 (사용자용)',
    description: '새로운 폴더를 생성합니다. 기본적으로 전사공개로 생성됩니다.',
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
      isPublic: true,
      permissionRankIds: null,
      permissionPositionIds: null,
      permissionDepartmentIds: null,
      order: dto.order,
      createdBy: user.id,
    });
    return WikiResponseDto.from(folder);
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
    description: '파일 상세 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '파일 조회 성공',
    type: WikiResponseDto,
  })
  @ApiParam({ name: 'id', description: '파일 ID' })
  async 파일을_조회한다(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<WikiResponseDto> {
    // TODO: 사용자 권한 확인 로직 구현 필요
    const file = await this.wikiBusinessService.파일을_조회한다(id);
    return WikiResponseDto.from(file);
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
    const { name, title, content } = body;

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
    );
    return WikiResponseDto.from(file);
  }
}
