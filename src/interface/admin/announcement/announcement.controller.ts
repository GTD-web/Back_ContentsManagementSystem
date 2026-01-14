import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { CurrentUser } from '@interface/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@interface/common/decorators/current-user.decorator';
import { AnnouncementBusinessService } from '@business/announcement-business/announcement-business.service';
import { CreateAnnouncementDto } from '@interface/common/dto/announcement/create-announcement.dto';
import {
  UpdateAnnouncementDto,
  UpdateAnnouncementPublicDto,
  UpdateAnnouncementFixedDto,
  UpdateAnnouncementOrderDto,
} from '@interface/common/dto/announcement/update-announcement.dto';
import {
  AnnouncementResponseDto,
  AnnouncementListResponseDto,
} from '@interface/common/dto/announcement/announcement-response.dto';
import { ContentStatus } from '@domain/core/content-status.types';

@ApiTags('A-9. 관리자 - 공지사항')
@ApiBearerAuth('Bearer')
@Controller('admin/announcements')
export class AnnouncementController {
  constructor(
    private readonly announcementBusinessService: AnnouncementBusinessService,
  ) {}

  /**
   * 공지사항 목록을 조회한다
   */
  @Get()
  @ApiOperation({
    summary: '공지사항 목록 조회',
    description: '공지사항 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '공지사항 목록 조회 성공',
    type: AnnouncementListResponseDto,
  })
  @ApiQuery({
    name: 'isPublic',
    required: false,
    description: '공개 여부 필터',
    type: Boolean,
  })
  @ApiQuery({
    name: 'isFixed',
    required: false,
    description: '고정 여부 필터',
    type: Boolean,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: '상태 필터',
    enum: ContentStatus,
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    description: '정렬 기준 (order: 정렬순서, createdAt: 생성일시)',
    enum: ['order', 'createdAt'],
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호 (기본값: 1)',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '페이지당 개수 (기본값: 10)',
    type: Number,
    example: 10,
  })
  async 공지사항_목록을_조회한다(
    @Query('isPublic') isPublic?: string,
    @Query('isFixed') isFixed?: string,
    @Query('status') status?: ContentStatus,
    @Query('orderBy') orderBy?: 'order' | 'createdAt',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<AnnouncementListResponseDto> {
    const isPublicFilter =
      isPublic === 'true' ? true : isPublic === 'false' ? false : undefined;
    const isFixedFilter =
      isFixed === 'true' ? true : isFixed === 'false' ? false : undefined;
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    const result =
      await this.announcementBusinessService.공지사항_목록을_조회한다({
        isPublic: isPublicFilter,
        isFixed: isFixedFilter,
        status,
        orderBy: orderBy || 'order',
        page: pageNum,
        limit: limitNum,
      });

    return {
      items: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit),
    };
  }

  /**
   * 공지사항 전체 목록을 조회한다 (페이지네이션 없음)
   */
  @Get('all')
  @ApiOperation({
    summary: '공지사항 전체 목록 조회',
    description: '페이지네이션 없이 모든 공지사항을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '공지사항 전체 목록 조회 성공',
    type: [AnnouncementResponseDto],
  })
  async 공지사항_전체_목록을_조회한다(): Promise<AnnouncementResponseDto[]> {
    return await this.announcementBusinessService.공지사항_전체_목록을_조회한다();
  }

  /**
   * 공지사항을 조회한다
   */
  @Get(':id')
  @ApiOperation({
    summary: '공지사항 상세 조회',
    description: '특정 공지사항의 상세 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '공지사항 ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: '공지사항 조회 성공',
    type: AnnouncementResponseDto,
  })
  async 공지사항을_조회한다(
    @Param('id') id: string,
  ): Promise<AnnouncementResponseDto> {
    return await this.announcementBusinessService.공지사항을_조회한다(id);
  }

  /**
   * 공지사항을 생성한다
   */
  @Post()
  @ApiOperation({
    summary: '공지사항 생성',
    description: '새로운 공지사항을 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '공지사항 생성 성공',
    type: AnnouncementResponseDto,
  })
  async 공지사항을_생성한다(
    @Body() dto: CreateAnnouncementDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<AnnouncementResponseDto> {
    // 날짜 변환
    const data = {
      ...dto,
      releasedAt: dto.releasedAt ? new Date(dto.releasedAt) : null,
      expiredAt: dto.expiredAt ? new Date(dto.expiredAt) : null,
      createdBy: user.id,
    };

    return await this.announcementBusinessService.공지사항을_생성한다(data);
  }

  /**
   * 공지사항을 수정한다
   */
  @Put(':id')
  @ApiOperation({
    summary: '공지사항 수정',
    description: '공지사항을 수정합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '공지사항 ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: '공지사항 수정 성공',
    type: AnnouncementResponseDto,
  })
  async 공지사항을_수정한다(
    @Param('id') id: string,
    @Body() dto: UpdateAnnouncementDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<AnnouncementResponseDto> {
    // 날짜 변환
    const data: any = { ...dto, updatedBy: user.id };
    if (dto.releasedAt) {
      data.releasedAt = new Date(dto.releasedAt);
    }
    if (dto.expiredAt) {
      data.expiredAt = new Date(dto.expiredAt);
    }

    return await this.announcementBusinessService.공지사항을_수정한다(id, data);
  }

  /**
   * 공지사항_공개를_수정한다
   */
  @Patch(':id/public')
  @ApiOperation({
    summary: '공지사항 공개 상태 수정',
    description: '공지사항의 공개 상태를 수정합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '공지사항 ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: '공지사항 공개 상태 수정 성공',
    type: AnnouncementResponseDto,
  })
  async 공지사항_공개를_수정한다(
    @Param('id') id: string,
    @Body() dto: UpdateAnnouncementPublicDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<AnnouncementResponseDto> {
    return await this.announcementBusinessService.공지사항_공개를_수정한다(
      id,
      dto.isPublic,
      user.id,
    );
  }

  /**
   * 공지사항_고정을_수정한다
   */
  @Patch(':id/fixed')
  @ApiOperation({
    summary: '공지사항 고정 상태 수정',
    description: '공지사항의 고정 상태를 수정합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '공지사항 ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: '공지사항 고정 상태 수정 성공',
    type: AnnouncementResponseDto,
  })
  async 공지사항_고정을_수정한다(
    @Param('id') id: string,
    @Body() dto: UpdateAnnouncementFixedDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<AnnouncementResponseDto> {
    return await this.announcementBusinessService.공지사항_고정을_수정한다(
      id,
      dto.isFixed,
      user.id,
    );
  }

  /**
   * 공지사항_오더를_수정한다
   */
  @Patch(':id/order')
  @ApiOperation({
    summary: '공지사항 순서 수정',
    description: '공지사항의 순서를 수정합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '공지사항 ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: '공지사항 순서 수정 성공',
    type: AnnouncementResponseDto,
  })
  async 공지사항_오더를_수정한다(
    @Param('id') id: string,
    @Body() dto: UpdateAnnouncementOrderDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<AnnouncementResponseDto> {
    return await this.announcementBusinessService.공지사항_오더를_수정한다(
      id,
      dto.order,
      user.id,
    );
  }

  /**
   * 공지사항을 삭제한다
   */
  @Delete(':id')
  @ApiOperation({
    summary: '공지사항 삭제',
    description: '공지사항을 삭제합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '공지사항 ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: '공지사항 삭제 성공',
  })
  async 공지사항을_삭제한다(@Param('id') id: string): Promise<{
    success: boolean;
  }> {
    const result =
      await this.announcementBusinessService.공지사항을_삭제한다(id);
    return { success: result };
  }
}
